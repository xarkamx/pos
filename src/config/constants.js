export const taxSystem = {
  "601": "General de Ley Personas Morales",
  "603": "Personas Morales con Fines no Lucrativos",
  "605": "Sueldos y Salarios e Ingresos Asimilados a Salarios",
  "606": "Arrendamiento",
  "608": "Demás ingresos",
  "609": "Consolidación",
  "610": "Residentes en el Extranjero sin Establecimiento Permanente en México",
  "611": "Ingresos por Dividendos (socios y accionistas)",
  "612": "Personas Físicas con Actividades Empresariales y Profesionales",
  "614": "Ingresos por intereses",
  "616": "Sin obligaciones fiscales",
  "620": "Sociedades Cooperativas de Producción que optan por diferir sus ingresos",
  "621": "Incorporación Fiscal",
  "622": "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
  "623": "Opcional para Grupos de Sociedades",
  "624": "Coordinados",
  "628": "Hidrocarburos",
  "607": "Régimen de Enajenación o Adquisición de Bienes",
  "629": "De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales",
  "630": "Enajenación de acciones en bolsa de valores",
  "615": "Régimen de los ingresos por obtención de premios",
  "625": "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
  "626": "Régimen Simplificado de Confianza"
}

export const PAYMENT_TYPE = [
  {
    "codigo": "01",
    "descripcion": "Efectivo"
  },
  {
    "codigo": "02",
    "descripcion": "Cheque nominativo"
  },
  {
    "codigo": "03",
    "descripcion": "Transferencia electrónica de fondos"
  },
  {
    "codigo": "04",
    "descripcion": "Tarjeta de crédito"
  },
  {
    "codigo": "05",
    "descripcion": "Monedero electrónico"
  },
  {
    "codigo": "06",
    "descripcion": "Dinero electrónico"
  },
  {
    "codigo": "08",
    "descripcion": "Vales de despensa"
  },
  {
    "codigo": "12",
    "descripcion": "Dación en pago"
  },
  {
    "codigo": "13",
    "descripcion": "Pago por subrogación"
  },
  {
    "codigo": "14",
    "descripcion": "Pago por consignación"
  },
  {
    "codigo": "15",
    "descripcion": "Condonación"
  },
  {
    "codigo": "17",
    "descripcion": "Compensación"
  },
  {
    "codigo": "23",
    "descripcion": "Novación"
  },
  {
    "codigo": "24",
    "descripcion": "Confusión"
  },
  {
    "codigo": "25",
    "descripcion": "Remisión de deuda"
  },
  {
    "codigo": "26",
    "descripcion": "Prescripción o caducidad"
  },
  {
    "codigo": "27",
    "descripcion": "A satisfacción del acreedor"
  },
  {
    "codigo": "28",
    "descripcion": "Tarjeta de débito"
  },
  {
    "codigo": "29",
    "descripcion": "Tarjeta de servicios"
  },
  {
    "codigo": "30",
    "descripcion": "Aplicación de anticipos"
  },
  {
    "codigo": "31",
    "descripcion": "Intermediario pagos"
  },
  {
    "codigo": "99",
    "descripcion": "Por definir"
  }
]

export const taxUses = {
  "G01": {
    "description": "Adquisición de mercancías.",
    "taxSystem": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
  },
  "G02": {
    "description": "Devoluciones, descuentos o bonificaciones.",
    "taxSystem": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
  },
  "G03": {
    "description": "Gastos en general.",
    "taxSystem": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
  },
  "I01": {
    "description": "Construcciones.",
    "taxSystem": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
  },
  "I02": {
    "description": "Mobiliario y equipo de oficina por inversiones.",
    "taxSystem": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
  },
  "I03": {
    "description": "Equipo de transporte.",
    "taxSystem": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
  },
  "I04": {
    "description": "Equipo de cómputo y accesorios.",
    "taxSystem": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
  },
  "I05": {
    "description": "Dados, troqueles, moldes, matrices y herramental.",
    "taxSystem": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
  },
  "I06": {
    "description": "Comunicaciones telefónicas.",
    "taxSystem": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
  },
  "I07": {
    "description": "Comunicaciones satelitales.",
    "taxSystem": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
  },
  "I08": {
    "description": "Otra maquinaria y equipo.",
    "taxSystem": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
  },
  "D01": {
    "description": "Honorarios médicos, dentales y gastos hospitalarios.",
    "taxSystem": "605, 606, 608, 611, 612, 614, 607, 615, 625"
  },
  "D02": {
    "description": "Gastos médicos por incapacidad o discapacidad.",
    "taxSystem": "605, 606, 608, 611, 612, 614, 607, 615, 625"
  },
  "D03": {
    "description": "Gastos funerales.",
    "taxSystem": "605, 606, 608, 611, 612, 614, 607, 615, 625"
  },
  "D04": {
    "description": "Donativos.",
    "taxSystem": "605, 606, 608, 611, 612, 614, 607, 615, 625"
  },
  "D05": {
    "description": "Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación).",
    "taxSystem": "605, 606, 608, 611, 612, 614, 607, 615, 625"
  },
  "D06": {
    "description": "Aportaciones voluntarias al SAR.",
    "taxSystem": "605, 606, 608, 611, 612, 614, 607, 615, 625"
  },
  "D07": {
    "description": "Primas por seguros de gastos médicos.",
    "taxSystem": "605, 606, 608, 611, 612, 614, 607, 615, 625"
  },
  "D08": {
    "description": "Gastos de transportación escolar obligatoria.",
    "taxSystem": "605, 606, 608, 611, 612, 614, 607, 615, 625"
  },
  "D09": {
    "description": "Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones.",
    "taxSystem": "605, 606, 608, 611, 612, 614, 607, 615, 625"
  },
  "D10": {
    "description": "Pagos por servicios educativos (colegiaturas).",
    "taxSystem": "605, 606, 608, 611, 612, 614, 607, 615, 625"
  },
  "S01": {
    "description": "Sin efectos fiscales.",
    "taxSystem": "601, 603, 605, 606, 608, 610, 611, 612, 614, 616, 620, 621, 622, 623, 624, 607, 615, 625, 626"
  },
  "CP01": {
    "description": "Pagos",
    "taxSystem": "601, 603, 605, 606, 608, 610, 611, 612, 614, 616, 620, 621, 622, 623, 624, 607, 615, 625, 626"
  },
  "CN01": {
    "description": "Nómina",
    "taxSystem": "605"
  }
}