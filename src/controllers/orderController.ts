import { NextFunction, Request, Response } from "express";
import * as orderService from "../services/orderService";
import { deleteCartById } from "../services/cartService";
import * as authService from "../services/authService";
import * as userService from "../services/userService";

import * as notiService from "../services/notiService";
import { sendResponse } from "../utils/responses";
import { ResponseMessages, StatusCodes } from "../utils/constants";
import { io } from "../server";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, perPage } = req.query;
    const skip = ((Number(page) || 1) - 1) * (Number(perPage) || 10);

    const { data, total, pageCounts } = await orderService.getAll(
      req.query as any,
      skip,
      Number(perPage) || 10
    );

    if (data.length === 0) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    } else {
      return sendResponse(
        res,
        data,
        StatusCodes.OK,
        ResponseMessages.SUCCESS,
        total,
        pageCounts
      );
    }
  } catch (error) {
    return next(error);
  }
};
export const downloadReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const format = req.params.format as "excel" | "pdf";

    const orders: any = await orderService.getAll(req.query as any);
    if (orders.data.length === 0) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    }
    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Orders Report");

      // Define column headers first
      worksheet.columns = [
        { header: "S.No", key: "serialNumber", width: 8 },
        { header: "Order Number", key: "orderNumber", width: 25 },
        { header: "Date", key: "orderDate", width: 20 },
        { header: "Customer", key: "customerName", width: 25 },
        { header: "Status", key: "orderStatus", width: 15 },
        { header: "Payment", key: "paymentStatus", width: 15 },
        { header: "Total Amount", key: "totalAmount", width: 15 },
      ];

      // Add empty rows for the title section
      worksheet.insertRows(1, [1, 2, 3]);

      // Add company name
      worksheet.mergeCells("A1:G1");
      worksheet.getCell("A1").value = "COMPANY NAME";
      worksheet.getCell("A1").font = { size: 16, bold: true };
      worksheet.getCell("A1").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Add report title
      worksheet.mergeCells("A2:G2");
      worksheet.getCell("A2").value = "Orders Report";
      worksheet.getCell("A2").font = { size: 12, bold: true };
      worksheet.getCell("A2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("A3:G3");
      worksheet.getCell(
        "A3"
      ).value = `Generated on: ${new Date().toLocaleString()}`;
      worksheet.getCell("A3").alignment = {
        horizontal: "right",
        vertical: "middle",
      };

      const headerRow = worksheet.getRow(4);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };
      headerRow.alignment = { horizontal: "center" };

      orders.data.forEach(
        (
          order: {
            orderNumber: string;
            orderDate: Date;
            customerName: string;
            orderStatus: string;
            paymentStatus: string;
            totalAmount: number;
          },
          index: number
        ) => {
          const row = worksheet.addRow({
            serialNumber: index + 1,
            orderNumber: order.orderNumber,
            orderDate: new Date(order.orderDate).toLocaleDateString(),
            customerName: order.customerName,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            totalAmount: order.totalAmount.toFixed(2),
          });

          if (index % 2 === 1) {
            row.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFAFAFA" },
            };
          }

          row.getCell(1).alignment = { horizontal: "center" };
          row.getCell(7).alignment = { horizontal: "right" };
        }
      );

      worksheet.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=orders-report.xlsx"
      );

      await workbook.xlsx.write(res);
      res.end();
    } else {
      const doc = new PDFDocument({ margin: 50 });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=orders-report.pdf"
      );

      doc.pipe(res);

      // Function to add a new page with table headers and borders
      const addTableHeaders = (y: number): number => {
        doc.fontSize(10).font("Helvetica-Bold");

        headers.forEach((header, i) => {
          const x =
            startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.rect(x, y - 5, columnWidths[i], 25).stroke(); // Add border
          doc.text(header, x, y, { width: columnWidths[i], align: "center" });
        });

        doc.font("Helvetica");
        return y + 20;
      };

      // Function to add a footer with page numbers
      const addFooter = () => {
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
          doc.switchToPage(i);
          doc.fontSize(8);
          doc.text(
            `Page ${i + 1} of ${pages.count}`,
            50,
            doc.page.height - 50,
            { align: "center" }
          );
        }
      };

      // Header section
      doc.fontSize(20).text("COMPANY NAME", { align: "center" });
      doc.fontSize(14).text("Orders Report", { align: "center" });
      doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, {
        align: "right",
      });
      doc.moveDown(2);

      // Table configuration
      const headers = [
        "S.No",
        "Order Number",
        "Date",
        "Customer",
        "Status",
        "Payment",
        "Total",
      ];
      const columnWidths = [40, 120, 80, 120, 70, 70, 70];
      const startX = 20;
      let currentY = 150;

      // Add table headers
      currentY = addTableHeaders(currentY);

      // Render table rows with alternating colors and borders
      orders.data.forEach((order: any, index: number) => {
        if (index % 2 === 0) {
          doc
            .fillColor("#f9f9f9")
            .rect(
              startX,
              currentY - 5,
              columnWidths.reduce((a, b) => a + b, 0),
              20
            )
            .fill()
            .fillColor("#000000");
        }

        const rowData = [
          (index + 1).toString(),
          order.orderNumber,
          new Date(order.orderDate).toLocaleDateString(),
          order.customerName,
          order.orderStatus,
          order.paymentStatus,
          `${order.totalAmount.toFixed(2)}`,
        ];

        rowData.forEach((text, i) => {
          const x =
            startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.rect(x, currentY - 5, columnWidths[i], 20).stroke(); // Add border
          doc.text(text, x, currentY, {
            width: columnWidths[i],
            align: i === 0 || i === columnWidths.length - 1 ? "center" : "left",
          });
        });

        currentY += 20;

        // Add new page if reaching the bottom
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
          currentY = addTableHeaders(currentY);
        }
      });

      // Add footer with page numbers
      addFooter();

      doc.end();
    }
  } catch (error) {
    return next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await orderService.getById(req.params.id);
    if (!data) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    } else {
      return sendResponse(res, data);
    }
  } catch (error) {
    return next(error);
  }
};

export const findByIdAndUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await orderService.updateOrderStatus(
      req.params.id,
      req.body.orderStatus
    );
    if (!data) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    } else {
      return sendResponse(res);
    }
  } catch (error) {
    return next(error);
  }
};

export const findByIdAndDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await orderService.findByIdAndDelete(req.params.id);
    if (!data) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    } else {
      return sendResponse(res);
    }
  } catch (error) {
    return next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await orderService.validateCartStock(req.body.cartId);

    const orderNumber = await orderService.generateOrderNumber();
    req.body.orderNumber = orderNumber;
    let isExist = null;
    if (req.body.userId) {
      isExist = await userService.getUserById(req.body.userId);
    }
    if (!req.body.userId || !isExist) {
      const userinfo = req.body.shippingAddress;
      const user: any = {
        username: userinfo.name,
        email: userinfo.email,
        phone: userinfo.phone,
        role: "user",
        address: {
          street: userinfo.street,
          city: userinfo.city,
          township: userinfo.township,
          postalCode: userinfo.postalCode,
        },
      };
      const resUser = await authService.createUser(user);
      req.body.userId = (resUser as { _id: any })._id.toString();
    }

    const order = await orderService.create(req.body);
    await orderService.deductCartStock(req.body.cartId);

    const notiData: any = {
      userId: req.body.userId,
      type: "order",
      message: `New order received: ${orderNumber}`,
    };
    await deleteCartById(req.body.cartId);

    await notiService.create(notiData);

    //io.emit("orderNotification", notiData);
    io.to("adminRoom").emit("orderNotification", notiData);

    return sendResponse(res, order, StatusCodes.CREATED);
  } catch (error) {
    return next(error);
  }
};

export const getOrdersByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await orderService.getOrdersByUserId(req.body.userId);
    if (!data) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    } else {
      return sendResponse(res, data);
    }
  } catch (error) {
    return next(error);
  }
};

export const getOrdersByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await orderService.getOrdersByStatus(
      req.body.userId,
      "Cancelled"
    );
    if (!data) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    } else {
      return sendResponse(res, data);
    }
  } catch (error) {
    return next(error);
  }
};
