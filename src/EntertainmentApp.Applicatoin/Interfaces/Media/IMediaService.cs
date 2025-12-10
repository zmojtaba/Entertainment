using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Interfaces.Media
{

    public class FileUploadResult
    {
        public string LocalFilePath { get; set; }
        public string OriginalFileName { get; set; }
    }
    public interface IMediaService
    {
        Task<FileUploadResult> UploadAsync(Stream bodyStream, string contentType, string category);
    }
}

