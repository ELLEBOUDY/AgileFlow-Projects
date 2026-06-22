-------------------------using MyDatabase-------------------------
--select 
--count(*) as totalNumberOfOrders,
--sum(sales) as totalSales,
--avg(sales) as avgSales,
--max(sales) as maxSale,
--min(sales) as minSale
--from orders

-------------------------using SalesDB-------------------------

select 
	OrderID,
	ProductID,
	OrderDate,
	sum(sales) over(partition by ProductID) TotalSalesByProduct
from Sales.Orders