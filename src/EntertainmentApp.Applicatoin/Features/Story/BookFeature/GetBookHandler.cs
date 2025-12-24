using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Story;

namespace EntertainmentApp.Applicatoin.Features.Story.BookFeature
{
    public class GetBookHandler
    {
        public record GetBooksQuery(string? language, string? genre): IQuery<List<BookDto>>;
        public class GetBooksQueryHandler(IStoryRepository storyRepo) : IQueryHandler<GetBooksQuery, List<BookDto>>
        {
            public async Task<List<BookDto>> Handle(GetBooksQuery request, CancellationToken cancellationToken)
            {


                List<Book> books = null;
                if (!string.IsNullOrEmpty(request.language) && string.IsNullOrEmpty(request.genre))
                    books = await storyRepo.GetBooksByLanguage(request.language);
                else if (!string.IsNullOrEmpty(request.language) && !string.IsNullOrEmpty(request.genre))
                    books = await storyRepo.GetBookByFilterAsync(request.language, request.genre);
                else if (string.IsNullOrEmpty(request.language) && !string.IsNullOrEmpty(request.genre))
                    books = await storyRepo.GetBooksByGenre(request.genre);
                else books = await storyRepo.GetBooksAsync();

                if (books == null || !books.Any())
                    throw new NotFoundException("Movie Not found");

                List<BookDto> result = books.Select(m => m.ToBookDto()).ToList();

                return books.Select(b => b.ToBookDto()).ToList();

            }
        }
    }
}
