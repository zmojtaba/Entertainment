using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Application.Interfaces.Media
{
    public interface IAudioPlayerService
    {
        void Play(string path);
        void Stop();
    }
}
