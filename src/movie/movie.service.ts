import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { ProducerAwardsDto } from './dto/producer-awards.dto';

@Injectable()
export class MovieService implements OnModuleInit {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async onModuleInit() {
    await this.loadMoviesFromCSV();
  }

  async loadMoviesFromCSV(): Promise<void> {
    const filePath = path.join(__dirname, '../../movielist.csv');
  
    // Verifica se o arquivo existe antes de tentar ler
    if (!fs.existsSync(filePath)) {
      console.error(`Erro: O arquivo ${filePath} não foi encontrado.`);
      return;
    }
  
    return new Promise((resolve, reject) => {
      const movies: Movie[] = [];
  
      fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', async (row) => {
          const movie = new Movie();
          movie.year = parseInt(row.year, 10);
          movie.title = row.title;
          movie.studios = row.studios;
          movie.producers = row.producers;
          movie.winner = row.winner?.toLowerCase() === 'yes';
  
          movies.push(movie);
        })
        .on('end', async () => {
          await this.movieRepository.save(movies);
          console.log('Filmes importados com sucesso!');
          resolve();
        })
        .on('error', (error) => {
          console.error('Erro ao ler o CSV:', error);
          reject(error);
        });
    });
  }
  

  async getAllMovies(): Promise<Movie[]> {
    return this.movieRepository.find();
  }


  async getProducerAwards(): Promise<{ min: ProducerAwardsDto[]; max: ProducerAwardsDto[] }> {
    const winners = await this.movieRepository.find({ where: { winner: true } });
  
    const producerMap = new Map<string, number[]>();
  
    for (const movie of winners) {
      const producers = movie.producers.split(',').map((p) => p.trim()); 
      for (const producer of producers) {
        if (!producerMap.has(producer)) {
            producerMap.set(producer, []); 
          }
          producerMap.get(producer)!.push(movie.year);
          
      }
    }
  
    const awardIntervals: ProducerAwardsDto[] = [];
  
    producerMap.forEach((years, producer) => {
      if (years.length > 1) {
        years.sort((a, b) => a - b); 
  
        for (let i = 1; i < years.length; i++) {
          awardIntervals.push({
            producer,
            interval: years[i] - years[i - 1],
            previousWin: years[i - 1],
            followingWin: years[i],
          });
        }
      }
    });
  
    if (awardIntervals.length === 0) {
      return { min: [], max: [] };
    }
  
    const minInterval = Math.min(...awardIntervals.map((a) => a.interval));
    const maxInterval = Math.max(...awardIntervals.map((a) => a.interval));
  
    return {
      min: awardIntervals.filter((a) => a.interval === minInterval),
      max: awardIntervals.filter((a) => a.interval === maxInterval),
    };
  }
  




}
