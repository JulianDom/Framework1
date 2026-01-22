import { BusinessValidationException } from '@shared/exceptions';

/**
 * StoreEntity - Entidad de Dominio
 *
 * Representa un local/sucursal del sistema.
 *
 * Características:
 * - Listado completo de locales
 * - Alta, edición y desactivación manual
 * - Importación desde Excel
 * - Validación de duplicados (nombre + dirección)
 * - Todos los locales activos por defecto
 */

/**
 * Coordenadas geográficas
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Metadatos adicionales del local
 */
export interface StoreMetadata {
  [key: string]: unknown;
}

/**
 * Propiedades base del local (sin id)
 */
export interface StorePropsBase {
  name: string;
  code: string;
  address: string;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  active?: boolean;
  metadata?: StoreMetadata | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Propiedades del local con id opcional (para compatibilidad)
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
   * El id se asignará al guardar en el repositorio.
   */
  static create(props: Omit<StorePropsBase, 'createdAt' | 'updatedAt' | 'deletedAt'>): StoreEntity {
    StoreEntity.validateName(props.name);
    StoreEntity.validateCode(props.code);
    StoreEntity.validateAddress(props.address);

    if (props.email) {
      StoreEntity.validateEmail(props.email);
    }

    return new StoreEntity(
      {
        ...props,
        country: props.country ?? 'Argentina',
        active: props.active ?? true, // Todos los locales activos por defecto
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
  static reconstitute(props: PersistedStoreProps): StoreEntity {
    return new StoreEntity(props, true);
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

  get code(): string {
    return this.props.code;
  }

  get address(): string {
    return this.props.address;
  }

  get city(): string | null {
    return this.props.city ?? null;
  }

  get state(): string | null {
    return this.props.state ?? null;
  }

  get zipCode(): string | null {
    return this.props.zipCode ?? null;
  }

  get country(): string {
    return this.props.country ?? 'Argentina';
  }

  get latitude(): number | null {
    return this.props.latitude ?? null;
  }

  get longitude(): number | null {
    return this.props.longitude ?? null;
  }

  get coordinates(): Coordinates | null {
    if (this.props.latitude != null && this.props.longitude != null) {
      return {
        latitude: this.props.latitude,
        longitude: this.props.longitude,
      };
    }
    return null;
  }

  get phone(): string | null {
    return this.props.phone ?? null;
  }

  get email(): string | null {
    return this.props.email ?? null;
  }

  get active(): boolean {
    return this.props.active ?? true;
  }

  get metadata(): StoreMetadata | null {
    return this.props.metadata ?? null;
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
   * Identificador único de duplicado: nombre + dirección
   */
  get duplicateKey(): string {
    return `${this.props.name.toLowerCase().trim()}|${this.props.address.toLowerCase().trim()}`;
  }

  /**
   * Dirección completa formateada
   */
  get fullAddress(): string {
    const parts = [this.props.address];
    if (this.props.city) parts.push(this.props.city);
    if (this.props.state) parts.push(this.props.state);
    if (this.props.zipCode) parts.push(this.props.zipCode);
    if (this.props.country) parts.push(this.props.country);
    return parts.join(', ');
  }

  // ==================== Domain Methods ====================

  updateDetails(data: {
    name?: string;
    address?: string;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
    country?: string;
    phone?: string | null;
    email?: string | null;
  }): void {
    if (data.name !== undefined) {
      StoreEntity.validateName(data.name);
      this.props.name = data.name;
    }
    if (data.address !== undefined) {
      StoreEntity.validateAddress(data.address);
      this.props.address = data.address;
    }
    if (data.city !== undefined) {
      this.props.city = data.city;
    }
    if (data.state !== undefined) {
      this.props.state = data.state;
    }
    if (data.zipCode !== undefined) {
      this.props.zipCode = data.zipCode;
    }
    if (data.country !== undefined) {
      this.props.country = data.country;
    }
    if (data.phone !== undefined) {
      this.props.phone = data.phone;
    }
    if (data.email !== undefined) {
      if (data.email) {
        StoreEntity.validateEmail(data.email);
      }
      this.props.email = data.email;
    }
    this.props.updatedAt = new Date();
  }

  updateCode(newCode: string): void {
    StoreEntity.validateCode(newCode);
    this.props.code = newCode;
    this.props.updatedAt = new Date();
  }

  updateCoordinates(coordinates: Coordinates | null): void {
    if (coordinates) {
      this.props.latitude = coordinates.latitude;
      this.props.longitude = coordinates.longitude;
    } else {
      this.props.latitude = null;
      this.props.longitude = null;
    }
    this.props.updatedAt = new Date();
  }

  updateMetadata(metadata: StoreMetadata | null): void {
    this.props.metadata = metadata;
    this.props.updatedAt = new Date();
  }

  /**
   * Activa el local
   */
  activate(): void {
    if (this.props.active) {
      throw new BusinessValidationException('Store is already active');
    }
    this.props.active = true;
    this.props.updatedAt = new Date();
  }

  /**
   * Desactiva el local
   */
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

  private static validateCode(code: string): void {
    if (!code || code.trim().length === 0) {
      throw new BusinessValidationException('Store code is required');
    }
    if (code.length > 50) {
      throw new BusinessValidationException('Store code must not exceed 50 characters');
    }
  }

  private static validateAddress(address: string): void {
    if (!address || address.trim().length === 0) {
      throw new BusinessValidationException('Store address is required');
    }
    if (address.length > 500) {
      throw new BusinessValidationException('Store address must not exceed 500 characters');
    }
  }

  private static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BusinessValidationException('Invalid email format');
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
