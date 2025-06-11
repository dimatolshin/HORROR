import { IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";
import { PopularCard } from "@/app/components/popularCard/popularCard";
import { TitleBlockUI } from "@/app/ui/titleBlockUI/titleBlockUI";

interface PopularProps {
  horror: IHorrorsPromise[];
}

export default async function PopularSection({ horror }: PopularProps) {
  return (
    <section id="popular" className="popular section--offset">
      <div className="container">
        <div className="popular__block">
          <TitleBlockUI
            title="Популярные квесты"
            href="horrors/1"
            label="Смотреть все"
          />
          <div className="grid gap-[50px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {horror.map((element) => (
              <PopularCard
                {...element}
                is_active={element.is_active}
                id={element.id}
                key={element.id}
                novelty={element.novelty}
                rating={element.rating}
                name={element.name}
                location={element.location}
                fear={element.fear}
                complexity={element.complexity}
                count_players={element.count_players}
                travel_time={element.travel_time}
                genre={element.genre}
                photos_back_card={element.photos_back_card}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
