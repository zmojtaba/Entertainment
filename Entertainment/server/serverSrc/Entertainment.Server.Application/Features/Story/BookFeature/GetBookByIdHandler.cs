namespace Entertainment.Server.Applicatoin.Features.Story.BookFeature
{
    public record GetBookByIdQuery(Guid Id) : IQuery<BookDto>;
    public class GetBookByIdHandler(IStoryRepository storyRepo) : IQueryHandler<GetBookByIdQuery, BookDto>
    {
        public async Task<BookDto> Handle(GetBookByIdQuery request, CancellationToken cancellationToken)
        {
            Book book = await storyRepo.GetBookByIdAsync(request.Id);
            if (book == null) throw new NotFoundException("Book Not found");
            return book.ToBookDto();
        }
    }
}
