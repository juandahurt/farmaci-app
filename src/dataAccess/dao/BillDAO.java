package dataAccess.dao;

import logic.Bill;

public interface BillDAO {
    boolean save(Bill newBill);
}
