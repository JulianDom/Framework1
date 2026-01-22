import { BusinessValidationException } from '@shared/exceptions';

/**
 * StoreEntity - Entidad de Dominio
 *
 * Representa un local del sistema.
 *
 * Campos:
 * - name: Nombre del local
 * - locality: Localidad
 * - zone: Zona (opcional)
 * - active: Estado activo/inactivo
 */

/**
 * Propiedades base del local (sin id)
 */
export interface StorePropsBase {
  name: string;
  locality: string;
  zone?: string | null;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Propiedades del local con id opcional
 */
export interface StoreProps extends StorePropsBase {
  id?: string;
}

/**
 * Propiedades del local persistido (id requerido)
 */
export interface PersistedStoreProps extends StorePropsBase {
  id: string;
}

export class StoreEntity {
  private props: StoreProps;
  private _isPersisted: boolean;

  private constructor(props: StoreProps, isPersisted: boolean = false) {
    this.props = props;
    this._isPersisted = isPersisted;
  }

  // ==================== Factory Methods ====================

  /**
   * Crea una nueva entidad de local (no persistida).
   */
  static create(props: Omit<StorePropsBase, 'createdAt' | 'updatedAt' | 'deletedAt'>): StoreEntity {
    StoreEntity.validateName(props.name);
    StoreEntity.validateLocality(props.locality);

    return new StoreEntity(
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
  static reconstitute(props: PersistedStoreProps): StoreEntity {
    return new StoreEntity(props, true);
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

  get locality(): string {
    return this.props.locality;
  }

  get zone(): string | null {
    return this.props.zone ?? null;
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
   * Identificador único de duplicado: nombre + localidad
   */
  get duplicateKey(): string {
    return `${this.props.name.toLowerCase().trim()}|${this.props.locality.toLowerCase().trim()}`;
  }

  // ==================== Domain Methods ====================

  updateDetails(data: {
    name?: string;
    locality?: string;
    zone?: string | null;
  }): void {
    if (data.name !== undefined) {
      StoreEntity.validateName(data.name);
      this.props.name = data.name;
    }
    if (data.locality !== undefined) {
      StoreEntity.validateLocality(data.locality);
      this.props.locality = data.locality;
    }
    if (data.zone !== undefined) {
      this.props.zone = data.zone;
    }
    this.props.updatedAt = new Date();
  }

  activate(): void {
    if (this.props.active) {
      throw new BusinessValidationException('Store is already active');
    }
    this.props.active = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    if (!this.props.active) {
      throw new BusinessValidationException('Store is already inactive');
    }
    this.props.active = false;
    this.props.updatedAt = new Date();
  }

  softDelete(): void {
    if (this.props.deletedAt) {
      throw new BusinessValidationException('Store is already deleted');
    }
    this.props.deletedAt = new Date();
    this.props.active = false;
    this.props.updatedAt = new Date();
  }

  restore(): void {
    if (!this.props.deletedAt) {
      throw new BusinessValidationException('Store is not deleted');
    }
    this.props.deletedAt = null;
    this.props.updatedAt = new Date();
  }

  // ==================== Validation ====================

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new BusinessValidationException('Store name is required');
    }
    if (name.length > 255) {
      throw new BusinessValidationException('Store name must not exceed 255 characters');
    }
  }

  private static validateLocality(locality: string): void {
    if (!locality || locality.trim().length === 0) {
      throw new BusinessValidationException('Locality is required');
    }
    if (locality.length > 100) {
      throw new BusinessValidationException('Locality must not exceed 100 characters');
    }
  }

  // ==================== Serialization ====================

  toObject(): StoreProps {
    return { ...this.props };
  }

  toPrimitives(): StoreProps {
    return { ...this.props };
  }
}
