import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { CategoryEntity } from './infrastructure/persistence/entities/CategoryEntity';
import { ProductEntity } from './infrastructure/persistence/entities/ProductEntity';
import { BrandEntity } from './infrastructure/persistence/entities/BrandEntity';
import { CategoryRepository } from './infrastructure/persistence/repositories/CategoryRepository';
import { ProductRepository } from './infrastructure/persistence/repositories/ProductRepository';
import { BrandRepository } from './infrastructure/persistence/repositories/BrandRepository';
import { UserRepository } from './infrastructure/persistence/repositories/UserRepository';
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
import { createCartRoutes } from './infrastructure/routes/cartRoutes';
import { CartController } from './infrastructure/controllers/CartController';
import { AddItemToCartUseCase } from './application/useCases/cart/AddItemToCartUseCase';
import { CartRepository } from './infrastructure/persistence/repositories/CartRepository';
import { RedisStorage } from './infrastructure/persistence/storage/RedisStorage';
import { UserAddressRepository } from './infrastructure/persistence/repositories/UserAddressRepository';
import { AddressEntity } from './infrastructure/persistence/entities/AddressEntity';
import { CreateAddressUseCase } from './application/useCases/address/CreateAddressUseCase';
import { UserAddressController } from './infrastructure/controllers/UserAddressController';
import { createUserAddressRoutes } from './infrastructure/routes/userAddressRoutes';
import { ProductVariantRepository } from './infrastructure/persistence/repositories/ProductVariantRepository';
import { ProductVariantEntity } from './infrastructure/persistence/entities/ProductVariantEntity';
import { CreateProductVariantUseCase } from './application/useCases/product/CreateProductVariantUseCase';
import { createProductVariantRoutes } from './infrastructure/routes/productVariantRoutes';

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
  // En la configuración de DataSource, agregar ProductVariantEntity
  entities: [CategoryEntity, ProductEntity, BrandEntity, UserEntity, AddressEntity, ProductVariantEntity],
  subscribers: [],
  migrations: [],
  dropSchema: false, // Set to true to drop all tables on startup
});

// Initialize storage
const storage = new RedisStorage();

(async () => {
  await storage.connect();
})();

// Initialize repositories
const categoryRepository = new CategoryRepository(AppDataSource.getRepository(CategoryEntity));
const productRepository = new ProductRepository(AppDataSource.getRepository(ProductEntity));
const brandRepository = new BrandRepository(AppDataSource.getRepository(BrandEntity));
const userRepository = new UserRepository(AppDataSource.getRepository(UserEntity));
const cartRepository = new CartRepository(storage);
const userAddressRepository = new UserAddressRepository(AppDataSource.getRepository(AddressEntity));

// Initialize use cases
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const createProductUseCase = new CreateProductUseCase(productRepository, categoryRepository);
const createBrandUseCase = new CreateBrandUseCase(brandRepository);
const addItemToCartUseCase = new AddItemToCartUseCase(cartRepository, productRepository);
const createAddressUseCase = new CreateAddressUseCase(userAddressRepository);

// Initialize repositories
const productVariantRepository = new ProductVariantRepository(AppDataSource.getRepository(ProductVariantEntity));

// Initialize use cases
const createProductVariantUseCase = new CreateProductVariantUseCase(productVariantRepository);

// Initialize controllers
const categoryController = new CategoryController(categoryRepository, productRepository, createCategoryUseCase);
const productController = new ProductController(
  productRepository, 
  createProductUseCase,
  createProductVariantUseCase,
  productVariantRepository // Agregar esta dependencia
);
const brandController = new BrandController(brandRepository, createBrandUseCase);
const cartController = new CartController(cartRepository, addItemToCartUseCase);
const userAddressController = new UserAddressController(userAddressRepository, createAddressUseCase);

// Crear servicios
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Crear rutas
const authRoutes = createAuthRoutes(authController);

// Rutas
app.use('/api/categories', createCategoryRoutes(categoryController));
app.use('/api/products', createProductRoutes(productController));
app.use('/api/products', createProductVariantRoutes(productController)); // Agregar esta línea
app.use('/api/brands', createBrandRoutes(brandController));
app.use('/api/auth', authRoutes);
app.use('/api/cart', createCartRoutes(cartController, authService));
app.use('/api/addresses', createUserAddressRoutes(userAddressController, authService));

// Añadir middleware de manejo de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

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