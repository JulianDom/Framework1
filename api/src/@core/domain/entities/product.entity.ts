import { BusinessValidationException } from '@shared/exceptions';

/**
 * ProductEntity - Entidad de Dominio
 *
 * Representa un producto del sistema.
 *
 * Campos:
 * - name: Nombre del producto
 * - description: Descripción (opcional)
 * - brand: Marca (opcional)
 * - presentation: Presentación (ej: "1kg", "500g", "1L")
 * - price: Precio
 * - active: Estado activo/inactivo
 */

/**
 * Propiedades base del producto (sin id)
 */
export interface ProductPropsBase {
  name: string;
  description?: string | null;
  brand?: string | null;
  presentation: string;
  price: number;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Propiedades del producto con id opcional
 */
export interface ProductProps extends ProductPropsBase {
  id?: string;
}

/**
 * Propiedades del producto persistido (id requerido)
 */
export interface PersistedProductProps extends ProductPropsBase {
  id: string;
}

export class ProductEntity {
  private props: ProductProps;
  private _isPersisted: boolean;

  private constructor(props: ProductProps, isPersisted: boolean = false) {
    this.props = props;
    this._isPersisted = isPersisted;
  }

  // ==================== Factory Methods ====================

  /**
   * Crea una nueva entidad de producto (no persistida).
   */
  static create(
    props: Omit<ProductPropsBase, 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): ProductEntity {
    ProductEntity.validateName(props.name);
    ProductEntity.validatePresentation(props.presentation);
    ProductEntity.validatePrice(props.price);

    return new ProductEntity(
      {
        ...props,
        active: props.active ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      false,
    );
  }

  /**
   * Reconstituye una entidad desde la base de datos.
   */
  static reconstitute(props: PersistedProductProps): ProductEntity {
    return new ProductEntity(props, true);
  }

  // ==================== State Checks ====================

  get isPersisted(): boolean {
    return this._isPersisted;
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get persistedId(): string {
    if (!this.props.id) {
      throw new BusinessValidationException('Entity has not been persisted yet');
    }
    return this.props.id;
  }

  // ==================== Getters ====================

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description ?? null;
  }

  get brand(): string | null {
    return this.props.brand ?? null;
  }

  get presentation(): string {
    return this.props.presentation;
  }

  get price(): number {
    return this.props.price;
  }

  get active(): boolean {
    return this.props.active ?? true;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt ?? null;
  }

  get isDeleted(): boolean {
    return this.props.deletedAt !== null;
  }

  /**
   * Identificador único de duplicado: nombre + presentación
   */
  get duplicateKey(): string {
    return `${this.props.name.toLowerCase().trim()}|${this.props.presentation.toLowerCase().trim()}`;
  }

  // ==================== Domain Methods ====================

  updateDetails(data: {
    name?: string;
    description?: string | null;
    brand?: string | null;
    presentation?: string;
  }): void {
    if (data.name !== undefined) {
      ProductEntity.validateName(data.name);
      this.props.name = data.name;
    }
    if (data.description !== undefined) {
      this.props.description = data.description;
    }
    if (data.brand !== undefined) {
      this.props.brand = data.brand;
    }
    if (data.presentation !== undefined) {
      ProductEntity.validatePresentation(data.presentation);
      this.props.presentation = data.presentation;
    }
    this.props.updatedAt = new Date();
  }

  updatePrice(newPrice: number): void {
    ProductEntity.validatePrice(newPrice);
    this.props.price = newPrice;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    if (this.props.active) {
      throw new BusinessValidationException('Product is already active');
    }
    this.props.active = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    if (!this.props.active) {
      throw new BusinessValidationException('Product is already inactive');
    }
    this.props.active = false;
    this.props.updatedAt = new Date();
  }

  softDelete(): void {
    if (this.props.deletedAt) {
      throw new BusinessValidationException('Product is already deleted');
    }
    this.props.deletedAt = new Date();
    this.props.active = false;
    this.props.updatedAt = new Date();
  }

  restore(): void {
    if (!this.props.deletedAt) {
      throw new BusinessValidationException('Product is not deleted');
    }
    this.props.deletedAt = null;
    this.props.updatedAt = new Date();
  }

  // ==================== Validation ====================

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new BusinessValidationException('Product name is required');
    }
    if (name.length > 255) {
      throw new BusinessValidationException('Product name must not exceed 255 characters');
    }
  }

  private static validatePresentation(presentation: string): void {
    if (!presentation || presentation.trim().length === 0) {
      throw new BusinessValidationException('Presentation is required');
    }
    if (presentation.length > 100) {
      throw new BusinessValidationException('Presentation must not exceed 100 characters');
    }
  }

  private static validatePrice(price: number): void {
    if (price < 0) {
      throw new BusinessValidationException('Price cannot be negative');
    }
  }

  // ==================== Serialization ====================

  toObject(): ProductProps {
    return { ...this.props };
  }

  toPrimitives(): ProductProps {
    return { ...this.props };
  }
}
