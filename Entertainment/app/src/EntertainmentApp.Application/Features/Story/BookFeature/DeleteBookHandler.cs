namespace EntertainmentApp.Application.Features.Story.BookFeature
{
    public record DeleteBookCommand(Guid Id) : ICommand;
    public class DeleteBookHandler(IStoryRepository storyRepo) : ICommandHandler<DeleteBookCommand>
    {

        public async Task<Unit> Handle(DeleteBookCommand command, CancellationToken cancellationToken)
        {
            Book? book = await storyRepo.GetBookByIdAsync(command.Id);
            if (book == null) throw new NotFoundException("Book not found");
            await storyRepo.DeleteBookAsync(book);
            return Unit.Value;

        }
    }
}
