using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Common.Constants
{
    public static class ValidExtensionList
    {
        public readonly static List<string> VideoExtension = new() { ".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".webm", ".mpeg" };
        public readonly static List<string> ImageExtension = new() { ".jpeg", ".jpg", ".png" };
        public readonly static List<string> BookExtension = new() { ".pdf" };
        public readonly static List<string> AudioExtension = new() { ".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac", "mp4" };
    }
}
