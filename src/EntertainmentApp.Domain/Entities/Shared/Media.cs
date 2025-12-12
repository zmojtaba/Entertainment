using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Domain.Entities.Shared
{
    public class Media : BaseEntity
    {
        public string StreamUrl { get; private set; }
        public string PosterImageUrl { get; private set; }
        public Movie Movie { get; private set; }

        private Media() { }
        public Media(string streamUrl, string posterImageUrl)
        {
            StreamUrl = streamUrl;
            PosterImageUrl = posterImageUrl;
        }


    }
}
