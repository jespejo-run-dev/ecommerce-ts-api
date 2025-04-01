import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { CategoryEntity } from './infrastructure/persistence/entities/CategoryEntity';
import { ProductEntity } from './infrastructure/persistence/entities/ProductEntity';
import { BrandEntity } from './infrastructure/persistence/entities/BrandEntity';
import { TypeOrmCategoryRepository } from './infrastructure/persistence/repositories/TypeOrmCategoryRepository';
import { TypeOrmProductRepository } from './infrastructure/persistence/repositories/TypeOrmProductRepository';
import { TypeOrmBrandRepository } from './infrastructure/persistence/repositories/TypeOrmBrandRepository';
import { TypeOrmUserRepository } from './infrastructure/persistence/repositories/TypeOrmUserRepository';
import { UserEntity } from './infrastructure/persistence/entities/UserEntity';
import { CreateCategoryUseCase } from './application/useCases/category/CreateCategoryUseCase';
import { CreateProductUseCase } from './application/useCases/product/CreateProductUseCase';
import { CreateBrandUseCase } from './application/useCases/brand/CreateBrandUseCase';
import { CategoryController } from './infrastructure/controllers/CategoryController';
import { ProductController } from './infrastructure/controllers/ProductController';
import { BrandController } from './infrastructure/controllers/BrandController';
import { createCategoryRoutes } from './infrastructure/routes/categoryRoutes';
import { createProductRoutes } from './infrastructure/routes/productRoutes';
import { createBrandRoutes } from './infrastructure/routes/brandRoutes';
import { AuthController } from './infrastructure/controllers/AuthController';
import { AuthService } from './application/services/AuthService';
import { createAuthRoutes } from './infrastructure/routes/authRoutes';

config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database connection
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ecommerce',
  synchronize: true, // Set to false in production
  logging: true,
  entities: [CategoryEntity, ProductEntity, BrandEntity, UserEntity],
  subscribers: [],
  migrations: [],
  dropSchema: true, // Set to true to drop all tables on startup
});

// Initialize repositories
const categoryRepository = new TypeOrmCategoryRepository(AppDataSource.getRepository(CategoryEntity));
const productRepository = new TypeOrmProductRepository(AppDataSource.getRepository(ProductEntity));
const brandRepository = new TypeOrmBrandRepository(AppDataSource.getRepository(BrandEntity));
const userRepository = new TypeOrmUserRepository(AppDataSource.getRepository(UserEntity));

// Initialize use cases
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const createProductUseCase = new CreateProductUseCase(productRepository, categoryRepository);
const createBrandUseCase = new CreateBrandUseCase(brandRepository);

// Initialize controllers
const categoryController = new CategoryController(categoryRepository, productRepository, createCategoryUseCase);
const productController = new ProductController(productRepository, createProductUseCase);
const brandController = new BrandController(brandRepository, createBrandUseCase);

// Crear servicios
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Crear rutas
const authRoutes = createAuthRoutes(authController);

// Routes
app.use('/api/categories', createCategoryRoutes(categoryController));
app.use('/api/products', createProductRoutes(productController));
app.use('/api/brands', createBrandRoutes(brandController));
app.use('/api/auth', authRoutes);

// Start server
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log('Error connecting to database:', error);
    process.exit(1);
  }); 