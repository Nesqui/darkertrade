import { Item } from 'src/item/item.entity';
import { CreateExistingItemDto } from './create-existing-item.dto';

export class SimilarExistingItemDto extends CreateExistingItemDto {
  item: Item;
  id?: number;
}
