import { ProductEntity } from '@core/domain/entities';

/**
 * IProductRepository - Puerto de Repositorio de Producto
 *
 * Define el contrato que debe cumplir cualquier implementación
 * de persistencia de productos.
 *
 * Campos del modelo Product:
 * - name, description, brand, presentation, price, active
 */
export interface IProductRepository {
  findById(id: string): Promise<ProductEntity | null>;
  findAll(page?: number, limit?: number, activeOnly?: boolean): Promise<{ data: ProductEntity[]; total: number }>;
  findActive(): Promise<ProductEntity[]>;
  findByBrand(brand: string): Promise<ProductEntity[]>;
  create(entity: ProductEntity): Promise<ProductEntity>;
  createMany(entities: ProductEntity[]): Promise<ProductEntity[]>;
  update(id: string, entity: Partial<ProductEntity>): Promise<ProductEntity>;
  activate(id: string): Promise<ProductEntity>;
  deactivate(id: string): Promise<ProductEntity>;
  /**
   * Verifica si existe un producto duplicado (mismo nombre + presentacion)
   */
  existsDuplicate(name: string, presentation: string, excludeId?: string): Promise<boolean>;
  /**
   * Busqueda de productos por nombre, descripcion, marca o presentacion
   */
  search(query: string, page?: number, limit?: number): Promise<{ data: ProductEntity[]; total: number }>;
}

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');
