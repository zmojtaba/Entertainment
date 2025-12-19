using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Common.Dtos
{
    public class CoruDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
    }
}
