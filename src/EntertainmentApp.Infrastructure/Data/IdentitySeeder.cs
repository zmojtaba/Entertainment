using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Infrastructure.Data
{
    public static class IdentitySeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var config = services.GetRequiredService<IConfiguration>();

            // Roles
            string[] roles = { "Admin", "User" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Admin user
            var adminUserName = config["AdminUser:UserName"];
            var adminPassword = config["AdminUser:Password"];

            var admin = await userManager.FindByNameAsync(adminUserName);

            if (admin == null)
            {
                admin = new ApplicationUser
                {
                    UserName = adminUserName,
                    Email = adminUserName,
                    EmailConfirmed = true
                };

                await userManager.CreateAsync(admin, adminPassword);
                await userManager.AddToRoleAsync(admin, "Admin");
            }
        }
    }

}
