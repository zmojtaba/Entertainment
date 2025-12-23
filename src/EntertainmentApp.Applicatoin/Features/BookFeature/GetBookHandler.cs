
using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Story;

namespace EntertainmentApp.Applicatoin.Features.BookFeature
{
    public class GetBookHandler
    {
        public record GetBooksQuery(): IQuery<List<BookDto>>;
        public class GetBooksQueryHandler(IStoryRepository storyRepo) : IQueryHandler<GetBooksQuery, List<BookDto>>
        {
            public async Task<List<BookDto>> Handle(GetBooksQuery request, CancellationToken cancellationToken)
            {
                List<Book> books = await storyRepo.GetBooksAsync();
                if (!books.Any() || books == null) throw new NotFoundException("Books Not found");
                return books.Select(b => b.ToBookDto()).ToList();

            }
        }
    }
}
