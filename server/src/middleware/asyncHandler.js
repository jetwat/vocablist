// middleware/asyncHandler.js
//
// ปัญหา: ถ้า controller เป็น async แล้ว throw error
//         Express ไม่รู้จัก → server crash
//
// แก้: wrap controller ด้วย try/catch อัตโนมัติ
//      แล้วส่ง error ไปให้ errorHandler ต่อ
//
// ใช้: export const myCtrl = asyncHandler(async (req, res) => { ... })

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
