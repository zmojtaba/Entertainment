using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Domain.Entities.Account
{
    public class UserLoginHistory : BaseEntity
    {
        public string Username { get; set; } = default!;
        public long LoginTime { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public bool IsSuccessful { get; set; }
    }
}
