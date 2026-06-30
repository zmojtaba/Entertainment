using Entertainment.Server.Domain.Entities.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entertainment.Server.Applicatoin.Common.Dtos
{
    public class UserInfoByTokenDto
    {
        public string UserName { get; set; }
        public string? Role { get; set; }
    }
}
