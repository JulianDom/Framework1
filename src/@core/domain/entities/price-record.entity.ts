import { BusinessValidationException } from '@shared/exceptions';

/**
 * PriceRecordEntity - Entidad de Dominio
 *
 * Representa un relevamiento de precio de un producto en un local.
 * Épica 8: Visualización/Consumo de Precios
 */

/**
 * Propiedades base del relevamiento de precio (sin id)
 */
export interface PriceRecordPropsBase {
  productId: string;
  storeId: string;
  operativeUserId: string;
  price: number;
  recordedAt: Date;
  notes?: string | null;
  photoUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Propiedades del relevamiento con id opcional
 */
export interface PriceRecordProps extends PriceRecordPropsBase {
  id?: string;
}

/**
 * Propiedades del relevamiento persistido (id requerido)
 */
export interface PersistedPriceRecordProps extends PriceRecordPropsBase {
  id: string;
}

/**
 * Datos expandidos para visualización (con relaciones)
 */
export interface PriceRecordWithRelations {
  id: string;
  price: number;
  recordedAt: Date;
  notes: string | null;
  photoUrl: string | null;
  product: {
    id: string;
    name: string;
    sku: string;
    presentation: string;
  };
  store: {
    id: string;
    name: string;
    code: string;
    address: string;
  };
  operativeUser: {
    id: string;
    fullName: string;
    username: string;
  };
}

export class PriceRecordEntity {
  private props: PriceRecordProps;
  private _isPersisted: boolean;

  private constructor(props: PriceRecordProps, isPersisted: boolean = false) {
    this.props = props;
    this._isPersisted = isPersisted;
  }

  // ==================== Factory Methods ====================

  /**
   * Crea un nuevo relevamiento de precio (no persistido).
   */
  static create(
    props: Omit<PriceRecordPropsBase, 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): PriceRecordEntity {
    PriceRecordEntity.validatePrice(props.price);

    return new PriceRecordEntity(
      {
        ...props,
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
  static reconstitute(props: PersistedPriceRecordProps): PriceRecordEntity {
    return new PriceRecordEntity(props, true);
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

  get productId(): string {
    return this.props.productId;
  }

  get storeId(): string {
    return this.props.storeId;
  }

  get operativeUserId(): string {
    return this.props.operativeUserId;
  }

  get price(): number {
    return this.props.price;
  }

  get recordedAt(): Date {
    return this.props.recordedAt;
  }

  get notes(): string | null {
    return this.props.notes ?? null;
  }

  get photoUrl(): string | null {
    return this.props.photoUrl ?? null;
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

  // ==================== Domain Methods ====================

  updatePrice(newPrice: number): void {
    PriceRecordEntity.validatePrice(newPrice);
    this.props.price = newPrice;
    this.props.updatedAt = new Date();
  }

  addNotes(notes: string): void {
    this.props.notes = notes;
    this.props.updatedAt = new Date();
  }

  setPhotoUrl(url: string | null): void {
    this.props.photoUrl = url;
    this.props.updatedAt = new Date();
  }

  softDelete(): void {
    if (this.props.deletedAt) {
      throw new BusinessValidationException('Price record is already deleted');
    }
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  // ==================== Validation ====================

  private static validatePrice(price: number): void {
    if (price < 0) {
      throw new BusinessValidationException('Price cannot be negative');
    }
  }

  // ==================== Serialization ====================

  toObject(): PriceRecordProps {
    return { ...this.props };
  }
}