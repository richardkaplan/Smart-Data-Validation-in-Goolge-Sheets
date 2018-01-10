/**
 * Test function for onEdit. Passes an event object to simulate an edit to
 * a cell in a spreadsheet.
 *
 * Check for updates: https://stackoverflow.com/a/16089067/1677912
 *
 * See https://developers.google.com/apps-script/guides/triggers/events#google_sheets_events
 */
function getEditObject(range) {

  var e = 
  {
    user : Session.getActiveUser().getEmail(),
    source : SpreadsheetApp.getActiveSpreadsheet(),
    range : range,
    value : range.getValue(),
    authMode : "LIMITED"
  };
  
  return e;
}



function ObjectOnEdit(e)
{
  var self = this;
  
  // range
  var r = e.range;
  // var r = SpreadsheetApp.getActive().getActiveRange();
  var numCols = r.getWidth();
  var numRows = r.getHeight();
  var boolCell = true;
  if (numRows > 1 || numCols > 1) { boolCell = false; }
  var numRow = r.getRow();
  var numCol = r.getColumn();
  var columns = [];
  if (boolCell) { columns.push(numCol); }
  else
  {
   for (var i = numCol; i <= numCol + numCols - 1; i++)
   {
    columns.push(parseInt(i));      
   }
  }
  
  self.range = r;
  self.numCols = numCols;
  self.numRows = numRows;
  self.numRow = numRow;
  self.numCol = numCol;
  self.boolCell = boolCell;
  self.columns = columns;
  
  self.getLastRow = r.getLastRow();
  self.getLastCol = r.getLastColumn();

  
  // get value or values
  // value    [[value]];
  // values   [[val1, val2]];
  this.getValues = function()
  {
    if (!self.boolCell) { return r.getValues(); }     
    var value = e.value;
    if (value == undefined || typeof value == 'object') { value = r.getValue(); }
    return [[value]];
  }  
  
  // old value
  var oldValue = e.oldValue;
  if (oldValue == undefined) { oldValue = ''; }
  if (typeof oldValue == 'object') { oldValue = ''; }
  
  self.oldValue = oldValue;
  
  // sheet and file
  var sheet = r.getSheet();
  var file = sheet.getParent();
  var idFile = file.getId();
  var nameSheet = sheet.getName();
  var idSheet = sheet.getSheetId(); 
  
  self.sheet = sheet;
  self.file = file;
  self.idFile = idFile;
  self.nameSheet = nameSheet;
  self.idSheet = idSheet;  
}



/* check, if row of range is > then row of headers
  results:
  * 0 -- don't match
  * 1 -- match  
*/
function checkRowDv(row, rowHead) {  
  if (row <= rowHead) { return 0; }
  return 1;
}




/* check, column matches
  input:
    * col          -         10
    * cols         -         10 or [10,11] or "1,2,3"
    * delim        -         ","
  
  results:
    * 0 -- don't match
    * 1 -- match  
*/
function checkColDv(col, cols, delim) {

  // number
  if (typeof cols == "number") {
    if (cols == col) { return 1; }
    return 0;      
  }
  
  // array
  var arr = [];
  if (Array.isArray(cols)) {
      arr = cols;
  }
  
  // string 
  if (typeof cols == "string") { 
    arr = cols.split(delim); 
    // convert into nums
    arr = arr.map(Number);
  }  

  if (arr.indexOf(col) != -1) { return 1; }
  
  return 0;

}
