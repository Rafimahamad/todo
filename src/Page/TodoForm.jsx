import { useEffect, useState } from "react";
import * as Papa from "papaparse";
import excelSheet from "./../assets/excelSheet.csv";
import { storeData } from "../service/Data";

const TodoForm = () => {
  const [data, setData] = useState({
    Name: "",
    StartTime: "",
    EndTime: "",
    noOfHrsWorked: "",
    rateperHr: "",
    supplierName: "",
    purchaseOrder: "",
  });

  const [errors, setErrors] = useState({
    Name: "",
    StartTime: "",
    EndTime: "",
    noOfHrsWorked: "",
    rateperHr: "",
    supplierName: "",
    purchaseOrder: "",
  });

  const [suppliers, setSuppliers] = useState();
  const [orders, setOrders] = useState();

  const [sheetDta, setSheetDta] = useState();

  const HandleChanges = (e, property) => {
    setData({ ...data, [property]: e.target.value });
  };

  useEffect(() => {
    loadDataFromCSV();
  }, []);

  const loadDataFromCSV = () => {
    try {
      const csvFilePath = excelSheet;
      Papa.parse(csvFilePath, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: (result) => {
          let dta = [...new Set(result.data.map((row) => row.Supplier))];
          setSheetDta(result.data);
          console.log(sheetDta);
          let Supplier = dta;
          console.log(Supplier);
          setSuppliers(Supplier);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleData = (event) => {
    event.preventDefault();
    let errors = {};

    if (!data.Name || !data.Name.trim()) {
      errors.Name = "* Name is required !";
    }
    if (!data.StartTime || !data.StartTime.trim()) {
      errors.StartTime = "* Start time is required !";
    }
    if (!data.EndTime || !data.EndTime.trim()) {
      errors.EndTime = "* End time is required !";
    }
    if (!data.noOfHrsWorked || !data.noOfHrsWorked.trim()) {
      errors.noOfHrsWorked = "* this is required !";
    }
    if (!data.rateperHr || !data.rateperHr.trim()) {
      errors.rateperHr = "* this is required !";
    }
    if (!data.supplierName || !data.supplierName.trim()) {
      errors.supplierName = "* this is required !";
    }
    if (!data.purchaseOrder || !data.purchaseOrder.trim()) {
      errors.purchaseOrder = "* this is required !";
    }
    setErrors(errors);
    if (Object.keys(errors).length === 0) {

      storeData(data).then(res=>{
        console.log(data);
        alert("Submitted SuccessFully !");
      }).catch(
        error => alert('Something went wrong !')
      )
     
    }
   
  };

  const handlePurchaseOrders = (e) => {
    HandleChanges(e, "supplierName");
    let filterDta = sheetDta.filter(
      (row) => row.Supplier === data.supplierName
    );
    const ordersDta = filterDta.map((row) => row.PO);
    console.log(ordersDta);
    setOrders(ordersDta);
  };

  return (
    <div className="App">
      <div className="container mt-4" style={{ color: "black" }}>
        <div className="row justify-content">
          <div className="col-md-4 offset-md-4">
            <div className="card p-3 border-2 shadow-2">
              <form onSubmit={handleData}>
                <h2 className="text-center mt-2"> # Todo Form ! </h2>

                <div className="form-group ">
                  <label>Name</label>
                  <input
                    type="text"
                    id="Name"
                    className="form-control"
                    placeholder="please enter username here"
                    name="Name"
                    value={data.Name}
                    onChange={(e) => HandleChanges(e, "Name")}
                  />
                  <div className="text-danger">
                    {errors.Name && <span>{errors.Name}</span>}
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label>Start Date</label>
                  <input
                    type="Date"
                    placeholder="enter startTime here"
                    name="StartTime"
                    id="StartTime"
                    className="form-control"
                    value={data.StartTime}
                    onChange={(e) => HandleChanges(e, "StartTime")}
                  />
                  <div className="text-danger">
                    {errors.startTime && <span>{errors.startTime}</span>}
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label>EndTime</label>
                  <input
                    type="Date"
                    placeholder="enter EndTime here"
                    name="EndTime"
                    id="EndTime"
                    className="form-control"
                    value={data.EndTime}
                    onChange={(e) => HandleChanges(e, "EndTime")}
                  />
                  <div className="text-danger">
                    {errors.EndTime && <span>{errors.EndTime}</span>}
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label> no Of Hours Worked</label>
                  <input
                    type="number"
                    placeholder="enter here"
                    name="noOfHrsWorked"
                    id="noOfHrsWorked"
                    className="form-control"
                    value={data.noOfHrsWorked}
                    onChange={(e) => HandleChanges(e, "noOfHrsWorked")}
                  />
                  <div className="text-danger">
                    {errors.noOfHrsWorked && (
                      <span>{errors.noOfHrsWorked}</span>
                    )}
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label>Rate per Hour</label>
                  <input
                    type="number"
                    name="rateperHr"
                    id="rateperHr"
                    className="form-control"
                    value={data.rateperHr}
                    onChange={(e) => HandleChanges(e, "rateperHr")}
                  />
                  <div className="text-danger">
                    {errors.rateperHr && <span>{errors.rateperHr}</span>}
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label>Choose Supplier Name</label>
                  {suppliers ? (
                    <select
                      className="form-control"
                      onChange={(e) => handlePurchaseOrders(e)}
                    >
                      <option value="">Select an option</option>
                      {suppliers.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    "something went wrong !"
                  )}

                  <div className="text-danger">
                    {errors.supplierName && <span>{errors.supplierName}</span>}
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label>Choose purchase Order</label>
                  {orders ? (
                    <select
                      className="form-control"
                      onChange={(e) => HandleChanges(e, "purchaseOrder")}
                    >
                      <option value="">Select an option</option>
                      {orders.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    "something went wrong !"
                  )}

                  <div className="text-danger">
                    {errors.purchaseOrder && (
                      <span>{errors.purchaseOrder}</span>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary m-3 ">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 export default TodoForm;