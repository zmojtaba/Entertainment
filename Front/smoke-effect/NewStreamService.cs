using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Backend.Application.Dtos;
using Backend.Application.Interfaces.RabbitMq;
using Backend.Application.Interfaces.Stream;
using Backend.Application.Mappers.Stream;
using Backend.Domain.Entities.Stream;
using Backend.Presentation.API.Dtos.Stream.CameraDtos;

namespace Backend.Application.Services.Stream
{
    public class NewStreamService : IStreamService
    {
        private readonly CameraStreamManager _streamManager;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IRtspRepository _rtspRepo;
        private readonly ICameraRepository _cameraRepo;
        private readonly IRabbitMqFramePublisher _framePublisher;
        public NewStreamService(
            CameraStreamManager streamManager,
            IServiceScopeFactory scopeFactory,
            IRtspRepository rtspRepository,
            ICameraRepository cameraRepo,
            IRabbitMqFramePublisher framePublisher

        )
        {
            _streamManager = streamManager;
            _scopeFactory = scopeFactory;
            _rtspRepo = rtspRepository;
            _cameraRepo = cameraRepo;
            _framePublisher = framePublisher;
        }

        public async Task FrameExtractor(int cameraId, string url, string tagName, CancellationToken externalToken)
        {
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(externalToken);
            var errorTcs = new TaskCompletionSource<Exception?>();
            using var scope = _scopeFactory.CreateScope();
            var framePublisher = scope.ServiceProvider.GetRequiredService<IRabbitMqFramePublisher>();

            using var ffmpeg = new Process();
            ffmpeg.StartInfo.FileName = "ffmpeg";
            if (url.StartsWith("rtsp://", StringComparison.OrdinalIgnoreCase))
            {
                ffmpeg.StartInfo.Arguments = $"-rtsp_transport tcp -re -i \"{url}\" -f image2pipe -vcodec mjpeg -q:v 1 -r 20 f scale=1920:1080 -an -";
            }
            else
            {
                ffmpeg.StartInfo.Arguments = $"-re -hide_banner -i \"{url}\" -f image2pipe -vcodec mjpeg -pix_fmt yuvj420p -r 20 -vf scale=1920:1080 -an -";
            }
            ffmpeg.StartInfo.RedirectStandardOutput = true;
            ffmpeg.StartInfo.RedirectStandardError = true;
            ffmpeg.StartInfo.UseShellExecute = false;
            ffmpeg.StartInfo.CreateNoWindow = true;

            ffmpeg.ErrorDataReceived += async (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    // ffmpegErrorOutput.AppendLine(e.Data);
                    // Console.ForegroundColor = ConsoleColor.Red;
                    // Console.WriteLine($"[FFmpeg Error] {e.Data}");
                    // Console.ResetColor();

                    // Console.WriteLine("######################### in error data recieved");

                    if (e.Data.IndexOf("Connection Timed out", StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!in error data recieved");
                        errorTcs.TrySetResult(new Exception("================Connection timed out"));
                    }
                    else if (e.Data.IndexOf("No such file or directory", StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        errorTcs.TrySetResult(new Exception("===============No such file or directory"));
                    }
                    else if (e.Data.IndexOf("Invalid data", StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        errorTcs.TrySetResult(new Exception("============Invalid data"));

                    }
                }
            };



            Console.WriteLine("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^11111");
            ffmpeg.Start();
            //TaskConfig taskConfig = await AddTaskConfig(cameraId, tagName, ffmpeg, cts);
            TaskConfig? taskConfig = await _streamManager.AddOrUpdateTaskConfigAsync(cameraId, new TaskConfig
            {
                CancellationTokenSource = cts,
                Process = ffmpeg,
                Tags = new List<string> { tagName}
            });
            if (taskConfig == null) throw new Exception("============ Can not add Task Config to manager");
            Console.WriteLine("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^2222");
            ffmpeg.BeginErrorReadLine();
            var outputStream = ffmpeg.StandardOutput.BaseStream;
            var buffer = new List<byte>();
            List<byte> frameBuffer = new();
            byte[] readBuffer = new byte[8192];

            while (!externalToken.IsCancellationRequested)
            {

                if (errorTcs.Task.IsCompleted)
                {
                    throw await errorTcs.Task; // <-- propagates the error back
                }
                //int bytesRead = await outputStream.ReadAsync(readBuffer, 0, readBuffer.Length);

                // Pass externalToken to ReadAsync for proper cancellation
                int bytesRead = 0;
                try
                {
                    bytesRead = await outputStream.ReadAsync(readBuffer, 0, readBuffer.Length, externalToken);
                }
                catch (OperationCanceledException)
                {
                    // This is expected if the token is cancelled while reading
                    Console.WriteLine($"***********************Read operation cancelled for camera {cameraId}.");
                    break; // Exit the loop as cancellation was requested
                }

                if (bytesRead <= 0) break;

                await Task.Run(async () =>
                {
                    for (int i = 0; i < bytesRead; i++)
                    {
                        frameBuffer.Add(readBuffer[i]);

                        // JPEG End Marker found (FF D9)
                        if (frameBuffer.Count >= 2 &&
                            frameBuffer[^2] == 0xFF && frameBuffer[^1] == 0xD9)
                        {
                            byte[] jpegBytes = frameBuffer.ToArray();

                            if (_streamManager.TaskConfigs.ContainsKey(cameraId))
                            {
                                if (_streamManager.TaskConfigs[cameraId].Tags.Count > 0 && !externalToken.IsCancellationRequested)
                                {
                                    foreach (string queueName in _streamManager.TaskConfigs[cameraId].Tags)
                                    {
                                        await framePublisher.SendFrameAsByteToAIAsync(queueName, cameraId, 1, jpegBytes);
                                    }
                                }

                                await framePublisher.SendImagesAsBase64Async(cameraId, jpegBytes);
                            }




                            // Console.WriteLine("Sent JPEG image for cameraId: " + cameraId);

                            frameBuffer.Clear();

                            // string base64 = Convert.ToBase64String(jpegBytes);
                            Console.WriteLine($"Frame extracted, size: {jpegBytes.Length} bytes");

                            // TODO: Send base64 to RabbitMQ or process it
                        }
                    }

                }, externalToken);
            }
            await ffmpeg.WaitForExitAsync();
            Console.WriteLine("//////////////////////////////////////////// ffmpeg status" + ffmpeg.ExitCode);
            if (ffmpeg.ExitCode != 0)
            {
                // Try to use the earlier captured error message if available
                if (errorTcs.Task.IsCompleted)
                {
                    throw await errorTcs.Task; // Known error from stderr
                }
                if (ffmpeg.ExitCode == -1)
                {
                    throw new OperationCanceledException("stopped");
                }
                else
                {
                    throw new Exception($"FFmpeg exited with code {ffmpeg.ExitCode} (unknown error)");
                }
            }
        }

        public async Task ProcessExecutor(Camera camera, string tagName)
        {


            string errorMessage = string.Empty;
            string _cameraStatus = string.Empty;
            CancellationTokenSource cts = new CancellationTokenSource();

            try
            {
                _cameraStatus = "running";
                await _streamManager.UpdateFFmpegMessageAsync(camera.CameraId, new FFmpegMessage
                {
                    Status = "running",
                    Message = "Successfully Added."
                });
                await Task.Delay(200);
                await FrameExtractor(camera.CameraId, camera.Rtsp.Url, tagName, cts.Token);

                // for file if the compiler reach this line means that ffmpeg endded and extracting that file finneshed.
                //for rtsp should test
                if (!camera.Rtsp.Url.StartsWith("rtsp://", StringComparison.OrdinalIgnoreCase))
                {
                    _cameraStatus = "finnished";
                }

            }
            catch (OperationCanceledException)
            {
                // This exception is caught when the CancellationToken is triggered.
                // It means the process was deliberately stopped.
                _cameraStatus = "stopped";
                errorMessage = "FFmpeg process was cancelled.";

                await _streamManager.UpdateFFmpegMessageAsync(camera.CameraId, new FFmpegMessage
                {
                    Status = _cameraStatus,
                    Message = errorMessage
                });
                Console.WriteLine($"FFmpeg process for camera {camera.CameraId} was cancelled.");
            }
            catch (Exception e)
            {
                _cameraStatus = "failed";
                errorMessage = e.ToString();
                FFmpegMessage ffmpegErrorMessage = await FrameExractorErrorHandeler(errorMessage);
                if (ffmpegErrorMessage.Status.Equals("stopped", StringComparison.OrdinalIgnoreCase))
                {
                    _cameraStatus = "stopped";
                }
                await _streamManager.UpdateFFmpegMessageAsync(camera.CameraId, new FFmpegMessage
                {
                    Status = _cameraStatus,
                    Message = errorMessage
                });
                Console.WriteLine("--------@@@@@-------------" + e.ToString());
                Console.WriteLine("start camera ---- ended with message of: " + ffmpegErrorMessage.Message);
            }
            finally
            {
                using var scope = _scopeFactory.CreateScope();
                var rtspRepo = scope.ServiceProvider.GetRequiredService<IRtspRepository>();
                await rtspRepo.ChangeRtspStatusAsync(Convert.ToInt32(camera.RtspId), _cameraStatus);
                var cameraRepo = scope.ServiceProvider.GetRequiredService<ICameraRepository>();
                var framePublisher = scope.ServiceProvider.GetService<IRabbitMqFramePublisher>();

                Console.WriteLine("----------------------111111111---------------");

                // Use the centralized RemoveTaskConfig method here
                // This ensures the process is killed and disposed of properly.
                if (await CheckTaskConfigTagsListIsEmpty(camera.CameraId))
                {
                    var removedTaskConfig = await RemoveTaskConfig(camera.CameraId);

                }


                if (!_cameraStatus.Equals("running", StringComparison.OrdinalIgnoreCase))
                {
                    foreach (Tag tag in camera.Tags)
                    {
                        await cameraRepo.RemoveCameraTag(camera.CameraId, tag.Name);
                    }
                    await framePublisher.SendMessageToCloseAIProcessor(camera.CameraId, "all");
                }
                // Update FFmpeg message one last time, even if it's already "stopped" from cancellation
                await _streamManager.UpdateFFmpegMessageAsync(camera.CameraId, new FFmpegMessage
                {
                    Status = _cameraStatus,
                    Message = errorMessage
                });
            }


            Console.WriteLine("start camera ---- ended with status of: " + _cameraStatus);
        }
        public async Task<FFmpegMessage> GetFFmpegMessageByCameraId(int cameraId)
        {
            if (_streamManager.FFmpegMessages.ContainsKey(cameraId))
                return _streamManager.FFmpegMessages[cameraId];
            return null;
        }
        public async Task<FFmpegMessage> FrameExractorErrorHandeler(string error)
        {
            string errorMessage = string.Empty;
            string status = string.Empty;
            if (error.IndexOf("Connection Timed out", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!in error data recieved");
                errorMessage = $"Your FFmpeg connection may be disconnected!\n Error: {error}";
                status = "failed";

            }
            else if (error.IndexOf("No such file or directory", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                errorMessage = $"No such file or directory!\n Error: {error}";
                status = "failed";

            }
            else if (error.IndexOf("Invalid data", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                errorMessage = $"Invalid data!\n Error: {error}";
                status = "failed";


            }
            else if (error.IndexOf("A task was canceled", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                errorMessage = $"A task was canceled!\n Error: {error}";
                status = "stopped";
            }
            else
            {
                errorMessage = $"Unknown Message!\n Error: {error}";
                status = "failed";

            }

            return new FFmpegMessage
            {
                Status = status,
                Message = errorMessage
            };

        }

        public async Task<Response> StartStreaming(Camera camera, StartCameraDto dto)
        {
            if (await IsProcessExist(camera.CameraId)) return new Response
            {
                StatusCode = 400,
                Message = "FFmpeg process is running for this task!"
            };


            Task.Run(() => ProcessExecutor(camera, dto.Tag.ToLower()));



            await Task.Delay(2000);

            FFmpegMessage ffmpegMessage = await GetFFmpegMessageByCameraId(camera.CameraId);
            await _rtspRepo.ChangeRtspStatusAsync(Convert.ToInt32(camera.RtspId), ffmpegMessage.Status);
            if (ffmpegMessage == null) return new Response
            {
                StatusCode = 500,
                Message = "Ffmpeg message is not created in process executor!"
            };

            if (!ffmpegMessage.Status.Equals("running", StringComparison.OrdinalIgnoreCase)) return new Response
            {
                StatusCode = 400,
                Message = ffmpegMessage.Message
            };
            Camera updatedCamera = await _cameraRepo.AddCameraTagAsync(camera, dto);
            await _framePublisher.SendMessageToRunAIProcessor(camera, dto.Tag.ToLower());
            return new Response
            {
                StatusCode = 200,
                Message = camera.ToCameraDto()
            };

        }


        public async Task<bool> IsProcessExist(int cameraId)
        {
            return _streamManager.TaskConfigs.ContainsKey(cameraId);
        }



        public async Task<bool> IsProcessExistByTagName(int cameraId, string tagName)
        {
            if (!await IsProcessExist(cameraId)) return false;
            return _streamManager.TaskConfigs[cameraId].Tags.Any(tag => tag.Equals(tagName, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<TaskConfig?> RemoveTaskConfig(int cameraId)
        {
            TaskConfig? removedTask = await _streamManager.RemoveTaskConfigAsync(cameraId);
            if (removedTask == null) return null;

            if (removedTask != null)
            {


                if (removedTask.Process != null && !removedTask.Process.HasExited)
                {
                    try
                    {
                        Console.WriteLine("----------");

                        removedTask.CancellationTokenSource.Cancel();

                        // 2. Wait a little for FrameExtractor to exit its loop
                        await Task.Delay(500);

                        removedTask.Process.Kill(true); // kill process + children
                                                        // 1. Cancel ongoing readin
                        Console.WriteLine($"FFmpeg process killed for camera {cameraId}");
                    }
                    catch (Exception ex)
                    {

                        Console.WriteLine($"000000000000000000000000Process Error killing FFmpeg process for camera {cameraId}: {ex.Message}");
                    }
                    finally
                    {
                        removedTask.Process.Dispose();
                    }
                }

                removedTask.CancellationTokenSource.Dispose();
            }

            return removedTask;      
        }

        public async Task<bool> CheckTaskConfigTagsListIsEmpty(int cameraId)
        {
            if (await IsProcessExist(cameraId))
            {
                if (_streamManager.TaskConfigs[cameraId].Tags.Count == 0)
                {
                    return true;
                }               
            }
            return false;
        }


    }
}