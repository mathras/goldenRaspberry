import { Controller, Get } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ProducerAwardsDto } from './dto/producer-awards.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('awards/producers')
  async getProducerAwards(): Promise<{ min: ProducerAwardsDto[]; max: ProducerAwardsDto[] }> {
    return this.movieService.getProducerAwards();
  }
}
