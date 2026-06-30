using EntertainmentApp.Domain.Entities;

namespace EntertainmentApp.Application.Common.Mappers
{
    public static class CoruMapper
    {
        public static CoruDto ToCoruDto(this Coru coru)
        {
            return new CoruDto
            {
                Id = coru.Id,
                Title = coru.Title,
                Country = coru.Country,
                City = coru.City,
                StreamUrl = coru.StreamUrl,
            };
        }
    }
}
