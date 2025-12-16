using System.Globalization;

namespace EntertainmentApp.Domain.Entities
{
    public  class Coru :BaseEntity
    {
        public string Title { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string StreamUrl { get; set; }

        public Coru() { }

        public Coru(string title, string country, string city, string streamUrl)
        {
            SetTitle(title);
            SetStreamUrl(streamUrl);
            SetCountries(country);
            SetCity(city);
        }
        public void SetTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title cannot be null or empty.", nameof(title));
            Title = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(title.Trim()); ;
        }

        public void SetCountries(string country)
        {
            if (string.IsNullOrWhiteSpace(country))
                throw new ArgumentException("Country cannot be null or empty.", nameof(country));
            Country = country;
        }
        public void SetCity(string city)
        {
            if (string.IsNullOrWhiteSpace(city))
                throw new ArgumentException("City cannot be null or empty.", nameof(city));
            City = city;
        }
        public void SetStreamUrl(string streamUrl)
        {
            if (string.IsNullOrWhiteSpace(streamUrl))
                throw new ArgumentException("StreamUrl cannot be null or empty.", nameof(streamUrl));
            StreamUrl = streamUrl;
        }



    }
}
