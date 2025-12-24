using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Story;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.Story.BookFeature
{
    public class DeleteBookHandler
    {
        public record DeleteBookCommand(Guid Id) : ICommand;
        public class DeleteBookCommandHandler(IStoryRepository storyRepo) : ICommandHandler<DeleteBookCommand>
        {
            public async Task<Unit> Handle(DeleteBookCommand command, CancellationToken cancellationToken)
            {
                Book? book =  await storyRepo.GetBookByIdAsync(command.Id);
                if (book == null) throw new NotFoundException("Book not found");
                await storyRepo.DeleteBookAsync(book);
                return Unit.Value;
            }
        }
    }
}
