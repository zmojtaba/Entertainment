using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Common.Models
{
    public class MediaUploadResult
    {
        // File Paths (saved on disk)
        public string Title { get;  set; }
        public string Description { get;  set; } = string.Empty;
        public List<string> Genres { get;  set; }
        public List<string> Languages { get;  set; }
        public List<string> Countries { get; set; }
        public int AgeGroup { get;  set; }
        public List<string> Directors { get;  set; } = new List<string>();
        public List<string> Actors { get;  set; } = new List<string>();
        //public IFormFile Image { get; private set; }
        public decimal ImdbRating { get;  set; }
        public long PublishedDate { get; set; }
        public string ImageUrl { get;  set; }
        public string StreamUrl { get;  set; }
    }
}
