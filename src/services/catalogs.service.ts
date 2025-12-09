import { CatalogsRepository } from '@/repositories/catalogs.repository';
import { ComboboxOption } from '@/types/catalogs';

/**
 * Catalogs Service
 * Contains business logic for catalog data
 */
export class CatalogsService {
  constructor(private repository: CatalogsRepository) { }

  /**
   * Get all catalog options for filters
   */
  async getAllCatalogOptions() {
    try {
      const [
        channels,
        geographies,
        hierarchies,
        chains,
        categories,
        brands,
        products,
      ] = await Promise.all([
        this.repository.getChannels(),
        this.repository.getGeographies(),
        this.repository.getCommercialHierarchies(),
        this.repository.getChains(),
        this.repository.getCategories(),
        this.repository.getBrands(),
        this.repository.getProducts(),
      ]);

      return {
        canal: channels,
        geografia: geographies,
        arbol: hierarchies,
        cadenaCliente: chains,
        categoria: categories,
        marca: brands,
        sku: products,
      };
    } catch (error) {
      console.error('Error loading all catalogs:', error);
      throw new Error(`Service error: ${(error as Error).message}`);
    }
  }

  /**
   * Get cliente-related catalogs only
   */
  async getClienteCatalogs() {
    try {
      const [channels, geographies, hierarchies, chains] = await Promise.all([
        this.repository.getChannels(),
        this.repository.getGeographies(),
        this.repository.getCommercialHierarchies(),
        this.repository.getChains(),
      ]);

      return {
        canal: channels,
        geografia: geographies,
        arbol: hierarchies,
        cadenaCliente: chains,
      };
    } catch (error) {
      console.error('Error loading cliente catalogs:', error);
      throw new Error(`Service error: ${(error as Error).message}`);
    }
  }

  /**
   * Get producto-related catalogs only
   */
  async getProductoCatalogs() {
    try {
      const [categories, brands, products] = await Promise.all([
        this.repository.getCategories(),
        this.repository.getBrands(),
        this.repository.getProducts(),
      ]);

      return {
        categoria: categories,
        marca: brands,
        sku: products,
      };
    } catch (error) {
      console.error('Error loading producto catalogs:', error);
      throw new Error(`Service error: ${(error as Error).message}`);
    }
  }
}
