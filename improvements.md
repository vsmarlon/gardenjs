# Project Improvements

This document outlines improvements for the PixelGarden minigame and the future NestJS backend architecture.

---

## Part 1: Minigame Improvements

### Gameplay Enhancements

#### 1. Weather System
- **Sunny**: Normal growth, bonus coins
- **Rainy**: Auto-waters plants, slower growth
- **Stormy**: Risk of damage, needs protection (umbrella item)
- **Snow**: Frost protection needed, winter flowers unlock

#### 2. Seasons
- Spring: Default, all flowers available
- Summer: Heat waves, need extra water
- Autumn: Bonus for certain flowers, leaf collection
- Winter: Special winter flowers (poinsettia, amaryllis)

#### 3. Pollinators (Automatic Helpers)
- **Bees**: Visit flowers, faster growth
- **Butterflies**: Attract to garden, rarity bonus
- **Hummingbirds**: Rare visitors, epic bonus

#### 4. Pests & Diseases
- **Aphids**: Spread between plants, need insecticide
- **Fungus**: Occurs in rainy weather, need fungicide
- **Ladybugs**: Natural pest control, attract with marigolds

#### 5. Plant Diseases
- Wilted flowers need revival potion
- Cross-pollination mechanics for hybrid flowers

### Progression System

#### 1. Achievements
- First flower, first bouquet
- Reach 100 coins, 1000 coins
- Create 10 bouquets
- Collect all rarities
- 7-day streak, 30-day streak

#### 2. Unlockables
- New flower types unlock through achievements
- Garden expansions (more plots)
- Special decorations
- Premium shop items

#### 3. Experience & Levels
- XP from planting, watering, harvesting
- Level up for perks (discounts, bonus drops)

### Social Features

#### 1. Share Bouquets
- Generate shareable link/image
- Dedicated "gift" URL for Vitória
- Save dedicated bouquet for special occasions

#### 2. Leaderboard (Future)
- Most bouquets created
- Highest streak
- Most rare flowers

#### 3. Garden Tours
- Visit other players' gardens (future)

### UI/UX Improvements

#### 1. Animations
- Smooth growth transitions
- Coin sparkle effects
- Bouquet creation celebration
- Tool selection bounce

#### 2. Sound Effects (Optional)
- Background music toggle
- Watering splish-splash
- Harvest chime
- Coin collect sound

#### 3. Mobile Optimization
- Touch-friendly larger cells
- Swipe gestures for tools
- Bottom toolbar for mobile

#### 4. Visual Polish
- Rarity glow effects on cells
- Animated tool icons
- Day/night visual change
- Particle effects on harvest

### Economy Balance

- Adjust plant cost vs sell price
- Rarity-weighted rewards
- Daily challenges for bonus coins
- Mystery boxes (random items)

---

## Part 2: Backend Architecture (NestJS BFF)

### Overview

Implement a NestJS Backend-for-Frontend (BFF) to:
- Persist game state to database
- Enable cross-device progress
- Enable future multiplayer features
- Handle user authentication

### Clean Architecture Structure

```
server/
├── src/
│   ├── core/                    # Shared utilities
│   │   ├── utils/               # Helper functions
│   │   ├── decorators/          # Custom decorators
│   │   ├── filters/             # Exception filters
│   │   ├── interceptors/        # Interceptors
│   │   └── constants/           # Shared constants
│   │
│   ├── modules/                 # Feature modules
│   │   ├── garden/
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── plant-flower.dto.ts
│   │   │   │   ├── water-flower.dto.ts
│   │   │   │   ├── harvest-flower.dto.ts
│   │   │   │   ├── create-bouquet.dto.ts
│   │   │   │   └── shop-item.dto.ts
│   │   │   │
│   │   │   ├── entities/        # Database entities
│   │   │   │   ├── garden-plot.entity.ts
│   │   │   │   ├── flower.entity.ts
│   │   │   │   ├── inventory.entity.ts
│   │   │   │   ├── bouquet.entity.ts
│   │   │   │   └── user.entity.ts
│   │   │   │
│   │   │   ├── repository/      # Repository pattern
│   │   │   │   ├── garden.repository.interface.ts
│   │   │   │   ├── garden.repository.ts
│   │   │   │   ├── flower.repository.interface.ts
│   │   │   │   └── flower.repository.ts
│   │   │   │
│   │   │   ├── service.ts       # Business logic
│   │   │   ├── controller.ts    # API endpoints
│   │   │   └── garden.module.ts
│   │   │
│   │   ├── user/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── repository/
│   │   │   ├── service.ts
│   │   │   ├── controller.ts
│   │   │   └── user.module.ts
│   │   │
│   │   └── shop/
│   │       ├── dto/
│   │       ├── entities/
│   │       ├── repository/
│   │       ├── service.ts
│   │       ├── controller.ts
│   │       └── shop.module.ts
│   │
│   ├── common/                  # Shared resources
│   │   ├── database/
│   │   │   └── database.module.ts
│   │   └── auth/
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── package.json
├── tsconfig.json
└── nest-cli.json
```

### Repository Pattern

Each repository:
- **Interface**: Defines contract (`*.repository.interface.ts`)
- **Implementation**: Actual DB calls (`*.repository.ts`)
- **Dependency Injection**: Injected into services

Example:

```typescript
// garden.repository.interface.ts
export interface IGardenRepository {
  findByUserId(userId: string): Promise<Garden>;
  save(garden: Garden): Promise<Garden>;
  updatePlot(userId: string, plotId: number, data: Partial<Plot>): Promise<Plot>;
}

// garden.repository.ts
@Repository('garden')
export class GardenRepository implements IGardenRepository {
  constructor(private readonly db: Database) {}

  async findByUserId(userId: string): Promise<Garden> {
    return this.db.garden.findUnique({ where: { userId } });
  }

  async save(garden: Garden): Promise<Garden> {
    return this.db.garden.upsert({ ... });
  }

  async updatePlot(userId: string, plotId: number, data: Partial<Plot>): Promise<Plot> {
    return this.db.plot.update({ where: { id: plotId }, data });
  }
}
```

### DTO Validation with class-validator

All inputs validated using `class-validator` and `class-transformer`:

```typescript
// plant-flower.dto.ts
import { IsEnum, IsInt, Min, Max, IsOptional } from 'class-validator';
import { FlowerType, Rarity } from '../../../../types/garden';

export class PlantFlowerDto {
  @IsInt()
  @Min(0)
  @Max(59) // 6 rows x 10 cols - 1
  row: number;

  @IsInt()
  @Min(0)
  @Max(9)
  col: number;

  @IsEnum(FlowerType)
  @IsOptional()
  flowerType?: FlowerType;

  @IsOptional()
  rarity?: Rarity;
}

// controller.ts
@Post(':userId/plant')
@UsePipes(new ValidationPipe({ transform: true }))
async plantFlower(
  @Param('userId') userId: string,
  @Body() dto: PlantFlowerDto,
) {
  return this.gardenService.plantFlower(userId, dto);
}
```

### Service Layer

Services handle business logic and use repositories:

```typescript
// garden.service.ts
@Injectable()
export class GardenService {
  constructor(
    @Inject('IGardenRepository') private readonly gardenRepo: IGardenRepository,
    @Inject('IInventoryRepository') private readonly inventoryRepo: IInventoryRepository,
  ) {}

  async plantFlower(userId: string, dto: PlantFlowerDto) {
    const garden = await this.gardenRepo.findByUserId(userId);
    
    if (!garden.canPlant(dto.row, dto.col)) {
      throw new BadRequestException('Plot is not empty');
    }
    
    const cost = PLANT_COST;
    const user = await this.userService.getUser(userId);
    
    if (user.coins < cost) {
      throw new NotFoundException('Insufficient coins');
    }

    const flower = await this.gardenRepo.plantFlower(userId, dto);
    await this.userService.deductCoins(userId, cost);

    return flower;
  }
}
```

### Controller Endpoints

RESTful API endpoints:

```typescript
// garden.controller.ts
@Controller('api/garden')
export class GardenController {
  constructor(private readonly gardenService: GardenService) {}

  @Get(':userId')
  async getGarden(@Param('userId') userId: string) {
    return this.gardenService.getGardenState(userId);
  }

  @Post(':userId/plant')
  @UsePipes(new ValidationPipe({ transform: true }))
  async plantFlower(
    @Param('userId') userId: string,
    @Body() dto: PlantFlowerDto,
  ) {
    return this.gardenService.plantFlower(userId, dto);
  }

  @Post(':userId/water')
  async waterFlower(
    @Param('userId') userId: string,
    @Body() dto: WaterFlowerDto,
  ) {
    return this.gardenService.waterFlower(userId, dto);
  }

  @Post(':userId/harvest')
  async harvestFlower(
    @Param('userId') userId: string,
    @Body() dto: HarvestFlowerDto,
  ) {
    return this.gardenService.harvestFlower(userId, dto);
  }

  @Get(':userId/inventory')
  async getInventory(@Param('userId') userId: string) {
    return this.gardenService.getInventory(userId);
  }

  @Post(':userId/sell')
  async sellFlower(
    @Param('userId') userId: string,
    @Body() dto: SellFlowerDto,
  ) {
    return this.gardenService.sellFlower(userId, dto);
  }

  @Post(':userId/bouquet')
  async createBouquet(
    @Param('userId') userId: string,
    @Body() dto: CreateBouquetDto,
  ) {
    return this.gardenService.createBouquet(userId, dto);
  }
}
```

### Database Options


1. **PostgreSQL**: For production with Prisma with prisma u dont need dtos. prisma service(or client i dont remember, provides the relations)
2. **Prisma**: Recommended ORM for TypeScript

### Module Dependency Graph

```
AppModule
├── DatabaseModule
├── GardenModule
│   ├── GardenService
│   ├── GardenRepository
│   ├── InventoryRepository
│   └── UserModule
├── UserModule
│   ├── UserService
│   └── UserRepository
└── ShopModule
    ├── ShopService
    └── ShopRepository
```

### API Response Format

```typescript
// Standard API response wrapper
export class ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Example response
{
  "success": true,
  "data": {
    "garden": { ... },
    "coins": 150
  }
}
```

---

## Implementation Priority

1. **Phase 1**: NestJS setup + basic garden CRUD
2. **Phase 2**: User authentication + inventory sync
3. **Phase 3**: Shop system + bouquet creation
4. **Phase 4**: Daily rewards + streak system
5. **Phase 5**: Social features (future)
