const dateToDMY = (date) =>  {
  try {
    const d = date.getDate() || 00;
    const m = date.getMonth() + 1 || 00; //Month from 0 to 11
    const y = date.getFullYear() || 0000;

    return `${(d <= 9 ? '0' + d : d)}-${(m<=9 ? '0' + m : m)}-${y}`;
  } catch(ex) {
    return null;
  }
}

const dateToYMD = (date) =>  {
  try {
    const d = date.getDate() || 00;
    const m = date.getMonth() + 1 || 00; //Month from 0 to 11
    const y = date.getFullYear() || 0000;
    
    return `${y}-${(m<=9 ? '0' + m : m)}-${(d <= 9 ? '0' + d : d)}`;
  } catch(ex) {
    return null;
  }
}

module.exports = {
  dateToDMY,
  dateToYMD,
};