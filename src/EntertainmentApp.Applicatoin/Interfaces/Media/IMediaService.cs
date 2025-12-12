using EntertainmentApp.Applicatoin.Common.Models;
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
        public Task<MediaUploadResult> UploadAsync(Stream bodyStream, string contentType, string category, string subCategory);
        public Task DeleteMediaFilesAsync(string streamUrl, string posterUrl, bool addBaseAddress=false);
        public Task DeleteMediaDirecoryAsync(string mediaDirectory, bool addBaseAddress = false);
    }
}

