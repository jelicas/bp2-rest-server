import { Database } from '..';
import { HttpError } from '../../error/HttpError';
import { Supplier } from '../../models/Supplier';

export const SupplierDb = {
  async getSuppliers() {
    return await Database.executeQuery(
      'SELECT id, \
              pib, \
              naziv as "name",\
              adresa as "address", \
              email, \
              maticni_broj as "nationalId", \
              (tekuci_racun).naziv_banke as "bankName", \
              (tekuci_racun).broj_racuna as "bankAccountName", \
              telefon as "telephoneNumber" \
              FROM dobavljac_view'
    );
  },
  async getSupplier(id: string) {
    const supplier = await Database.executeQuery(
      'SELECT id, \
              pib, \
              naziv as "name",\
              adresa as "address", \
              email, \
              maticni_broj as "nationalId", \
              (tekuci_racun).naziv_banke as "bankName", \
              (tekuci_racun).broj_racuna as "bankAccountName", \
              telefon as "telephoneNumber"\
              FROM dobavljac_view WHERE id = $1',
      [id]
    );

    if (!supplier) {
      throw new HttpError(404, 'Supplier not found!');
    }
    return supplier;
  },
  async insertSupplier(supplier: Supplier) {
    return await Database.executeQuery(
      'INSERT INTO dobavljac_view(id, pib, naziv, adresa, email, maticni_broj, tekuci_racun, telefon) VALUES($1, $2, $3, $4, $5, $6, ($8, $7), $9)',
      [
        supplier.getId(),
        supplier.getPib(),
        supplier.getName(),
        supplier.getAddress(),
        supplier.getEmail(),
        supplier.getNationalId(),
        supplier.getBankName(),
        supplier.getBankAccountNumber(),
        supplier.getTelephoneNumber(),
      ]
    );
  },
  async updateSupplier(supplier: Supplier) {
    const result = await Database.executeQuery(
      'UPDATE dobavljac_view SET pib = $1, \
                           naziv = $2, \
                           adresa = $3, \
                           email = $4, \
                           maticni_broj= $5, \
                           tekuci_racun = ($7, $6), \
                           telefon = $8 \
                           WHERE id = $9',
      [
        supplier.getPib(),
        supplier.getName(),
        supplier.getAddress(),
        supplier.getEmail(),
        supplier.getNationalId(),
        supplier.getBankName(),
        supplier.getBankAccountNumber(),
        supplier.getTelephoneNumber(),
        supplier.getId(),
      ]
    );

    if (result.rowCount === 0) {
      throw new HttpError(404, 'Supplier not found!');
    }
  },
  async deleteSupplier(id: number) {
    const result = await Database.executeQuery('DELETE FROM dobavljac_view WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      throw new HttpError(404, 'Supplier not found!');
    }
  },
};
