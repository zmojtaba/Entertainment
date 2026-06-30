
namespace EntertainmentApp.Application.CQRS;
public interface IQuery<out TResponse> : IRequest<TResponse>  
    where TResponse : notnull
{
}
