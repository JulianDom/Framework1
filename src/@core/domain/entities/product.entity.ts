import { BusinessValidationException } from '@shared/exceptions';

/**
 * ProductEntity - Entidad de Dominio
 *
 * Representa un producto del sistema.
 *
 * Características:
 * - ABM de productos
 * - Importación desde Excel
 * - Activación/desactivación
 * - Prevención de duplicados (nombre + presentación)
 * - Productos diferenciados por presentación (ej: 1kg y 500g son productos distintos)
 * - Precio siempre unitario
 */

/**
 * Propiedades base del producto (sin id)
 */
export interface ProductPropsBase {
  name: string;
  description?: string | null;
  sku: string;
  barcode?: string | null;
  presentation: string;
  unitPrice: number;
  category?: string | null;
  brand?: string | null;
  active?: boolean;
  imageUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Propiedades del producto con id opcional (para compatibilidad)
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
   * El id se asignará al guardar en el repositorio.
   */
  static create(
    props: Omit<ProductPropsBase, 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): ProductEntity {
    ProductEntity.validateName(props.name);
    ProductEntity.validateSku(props.sku);
    ProductEntity.validatePresentation(props.presentation);
    ProductEntity.validateUnitPrice(props.unitPrice);

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
   * Debe incluir el id obligatoriamente.
   */
  static reconstitute(props: PersistedProductProps): ProductEntity {
    return new ProductEntity(props, true);
  }

  // ==================== State Checks ====================

  /**
   * Indica si la entidad fue persistida (tiene id de BD)
   */
  get isPersisted(): boolean {
    return this._isPersisted;
  }

  /**
   * Retorna el id de la entidad.
   */
  get id(): string | undefined {
    return this.props.id;
  }

  /**
   * Retorna el id garantizado.
   * Lanza error si la entidad no está persistida.
   */
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

  get sku(): string {
    return this.props.sku;
  }

  get barcode(): string | null {
    return this.props.barcode ?? null;
  }

  get presentation(): string {
    return this.props.presentation;
  }

  get unitPrice(): number {
    return this.props.unitPrice;
  }

  get category(): string | null {
    return this.props.category ?? null;
  }

  get brand(): string | null {
    return this.props.brand ?? null;
  }

  get active(): boolean {
    return this.props.active ?? true;
  }

  get imageUrl(): string | null {
    return this.props.imageUrl ?? null;
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
    barcode?: string | null;
    presentation?: string;
    category?: string | null;
    brand?: string | null;
    imageUrl?: string | null;
  }): void {
    if (data.name !== undefined) {
      ProductEntity.validateName(data.name);
      this.props.name = data.name;
    }
    if (data.description !== undefined) {
      this.props.description = data.description;
    }
    if (data.barcode !== undefined) {
      this.props.barcode = data.barcode;
    }
    if (data.presentation !== undefined) {
      ProductEntity.validatePresentation(data.presentation);
      this.props.presentation = data.presentation;
    }
    if (data.category !== undefined) {
      this.props.category = data.category;
    }
    if (data.brand !== undefined) {
      this.props.brand = data.brand;
    }
    if (data.imageUrl !== undefined) {
      this.props.imageUrl = data.imageUrl;
    }
    this.props.updatedAt = new Date();
  }

  updatePrice(newUnitPrice: number): void {
    ProductEntity.validateUnitPrice(newUnitPrice);
    this.props.unitPrice = newUnitPrice;
    this.props.updatedAt = new Date();
  }

  updateSku(newSku: string): void {
    ProductEntity.validateSku(newSku);
    this.props.sku = newSku;
    this.props.updatedAt = new Date();
  }

  /**
   * Activa el producto
   */
  activate(): void {
    if (this.props.active) {
      throw new BusinessValidationException('Product is already active');
    }
    this.props.active = true;
    this.props.updatedAt = new Date();
  }

  /**
   * Desactiva el producto
   */
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

  private static validateSku(sku: string): void {
    if (!sku || sku.trim().length === 0) {
      throw new BusinessValidationException('SKU is required');
    }
    if (sku.length > 100) {
      throw new BusinessValidationException('SKU must not exceed 100 characters');
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

  private static validateUnitPrice(price: number): void {
    if (price < 0) {
      throw new BusinessValidationException('Unit price cannot be negative');
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
