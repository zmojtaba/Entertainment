using EntertainmentApp.Domain.Entities.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Dtos
{
    public class AddMovieDto
    {
        public string Title { get; private set; }
        public string Description { get; private set; }
        public List<string> Genres { get; private set; }
        public List<string> Language { get; private set; } 
        public int AgeGroup { get; private set; }
        public List<string> Directors { get; private set; } = new List<string>();
        public List<string> Actors { get; private set; } = new List<string>();
        //public IFormFile Image { get; private set; }
        public decimal ImdbRating { get; private set; }
        public long PublishedDate { get; private set; }

    }
}
