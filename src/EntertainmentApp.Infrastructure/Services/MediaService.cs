using EntertainmentApp.API.Helpers;
using EntertainmentApp.Applicatoin.Common.Models;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using MediatR;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
using System.Text.Json;

namespace EntertainmentApp.Infrastructure.Services
{
    public class MediaService : IMediaService
    {
        private readonly IConfiguration _configuration;
        public MediaService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<MediaUploadResult> UploadAsync( Stream bodyStream, string contentType )
        {
            var mediaUploadResult = new MediaUploadResult();
            string baseMediaPath = _configuration["BaseStoragePath"] ?? "C://EntertainmentMedia";

            var boundary = MultipartRequestHelper.GetBoundary(
                MediaTypeHeaderValue.Parse(contentType),
                70_000);

            var reader = new MultipartReader(boundary, bodyStream);
            MultipartSection section;

            string tempPath = Path.Combine(baseMediaPath, "temp");
            string streamPath = null;
            string streamFileName = null;
            string posterFileName = null;
            string posterPath = null;

            while ((section = await reader.ReadNextSectionAsync()) != null)
            {
                if (!ContentDispositionHeaderValue.TryParse(
                    section.ContentDisposition, out var disposition))
                    continue;

                // FILE
                if (MultipartRequestHelper.HasFileContentDisposition(disposition))
                {
                    string name = HeaderUtilities.RemoveQuotes(disposition.Name).Value;
                    string fileName = Path.GetFileName(HeaderUtilities.RemoveQuotes(disposition.FileName).Value);

                    //var fileExtention = Path.GetExtension(safeName);

                    if (!Directory.Exists(tempPath) ) Directory.CreateDirectory(tempPath);

                    string storagePath = Path.Combine(tempPath, fileName);

                    if (name.Equals("media", StringComparison.OrdinalIgnoreCase))
                    {
                        streamPath = storagePath;
                        streamFileName = fileName;
                    }

                    else if (name.Equals("poster", StringComparison.OrdinalIgnoreCase))
                    {
                        posterPath = storagePath;
                        posterFileName = fileName;
                    }

                        using var target = File.Create(storagePath);
                    await section.Body.CopyToAsync(target);
                }
                // FORM FIELD
                else if (MultipartRequestHelper.HasFormDataContentDisposition(disposition))
                {
                    using var reader2 = new StreamReader(section.Body);
                    var value = await reader2.ReadToEndAsync();
                    var key = HeaderUtilities.RemoveQuotes(disposition.Name).Value;

                    MapToDto(mediaUploadResult, key, value);
                }
            }

            if (streamPath == null || posterPath == null )
                throw new Exception("Video file missing");



            string mediaDirectory = Path.Combine(baseMediaPath, "video", "movie", CleanFileName(mediaUploadResult.Title));
            if (!Directory.Exists(mediaDirectory))
            {

                Directory.CreateDirectory(mediaDirectory);
            }
            string newStreamPath = Path.Combine(mediaDirectory, streamFileName);
            string newPosterPath = Path.Combine(mediaDirectory, posterFileName);
            mediaUploadResult.StreamUrl = newStreamPath;
            mediaUploadResult.ImageUrl = newPosterPath;

            try
            {

                File.Move(streamPath, newStreamPath, overwrite: true);
                File.Move(posterPath, newPosterPath, overwrite: true);

                return mediaUploadResult;
            }
            catch (Exception ex)
            {
                Directory.Delete(mediaDirectory, recursive: true);
                File.Delete(streamPath);
                File.Delete(posterPath);
                throw;
            }

            
        }

        private static string CleanFileName(string name)
        {
            foreach (var c in Path.GetInvalidFileNameChars())
            {
                name = name.Replace(c.ToString(), "");
            }
            return name;
        }
        //private static List<string> GenerateMediaPath()
        //{
        //    return "";
        //}
        private static void MapToDto(MediaUploadResult dto, string key, string value)
        {
            switch (key)
            {
                case "Title":
                    dto.Title = value;
                    break;

                case "Description":
                    dto.Description = value;
                    break;

                case "AgeGroup":
                    dto.AgeGroup = int.Parse(value);
                    break;

                case "ImdbRating":
                    dto.ImdbRating = decimal.Parse(value);
                    break;
                case "PublishedDate":
                    dto.PublishedDate = int.Parse(value);
                    break;

                case "Genres":
                    dto.Genres = JsonSerializer.Deserialize<List<string>>(value);
                    break;

                case "Directors":
                    dto.Directors = JsonSerializer.Deserialize<List<string>>(value);
                    break;

                case "Actors":
                    dto.Actors= JsonSerializer.Deserialize<List<string>>(value);
                    break;
                case "Languages":
                    dto.Languages = JsonSerializer.Deserialize<List<string>>(value);
                    break;

                case "Countries":
                    dto.Countries = JsonSerializer.Deserialize<List<string>>(value);
                    break;
            }
        }


    }
}
