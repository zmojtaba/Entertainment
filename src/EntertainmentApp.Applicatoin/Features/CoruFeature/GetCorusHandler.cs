namespace EntertainmentApp.Applicatoin.Features.CoruFeature
{
    public class GetCorusHandler 
    {
        public record GetCorousCommand() : IRequest<List<CoruDto>>;

    }
}
