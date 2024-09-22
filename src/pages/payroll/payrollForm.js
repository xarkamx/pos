import { useEffect } from 'react';
import { QuickFormButton, QuickFormContainer, QuickFormInput } from '../../components/Containers/QuickFormContainer';
import { useCState } from '../../hooks/useHooks';

export function PayrollForm ({ onSubmit, employee = {}, loading, btnText = 'Agregar Empleado' }) {
  const [payroll, setPayroll] = useCState({
    name: '',
    email: '',
    phone: '',
    ptoDays: 0,
    rfc: '',
    salaryPerDay: 0,
    bankName: '',
    accountNumber: ''
  })
  useEffect(() => {
    if (employee.id) {
      setPayroll(employee)
    }
  }, [employee, setPayroll])
  return (
    <QuickFormContainer

      title='Empleado' onSubmit={async () => {
        await onSubmit(payroll)
      }}>
      <QuickFormInput
        value={payroll.name}
        fullWidth label="Nombre" onChange={(ev) => {
          setPayroll({ name: ev.target.value })
        }} />
      <QuickFormInput
        value={payroll.email}
        fullWidth label="Email" type='email' onChange={(ev) => {
          setPayroll({ email: ev.target.value })
        }} />
      <QuickFormInput
        value={payroll.phone}
        fullWidth label="Teléfono" type='tel' onChange={(ev) => {
          setPayroll({ phone: ev.target.value })
        }} />
      <QuickFormInput
        value={payroll.ptoDays}
        fullWidth label="Días de PTO" type='text' onChange={(ev) => {
          setPayroll({ ptoDays: ev.target.value })
        }} />
      <QuickFormInput
        value={payroll.rfc}
        fullWidth label="RFC"
        pattern={'[A-Z]{4}[0-9]{6}[A-Z0-9]{3}'}
        onChange={(ev) => {
          setPayroll({ rfc: ev.target.value })
        }} />
      <QuickFormInput
        value={payroll.salaryPerDay}
        fullWidth label="Salario por dia" type='text' onChange={(ev) => {
          setPayroll({ salaryPerDay: ev.target.value })
        }} />
      <QuickFormInput
        value={payroll.bankName}
        type='text'
        fullWidth label="Nombre del Banco" onChange={(ev) => {
          setPayroll({ bankName: ev.target.value })
        }} />
      <QuickFormInput
        value={payroll.accountNumber}
        type='text'
        fullWidth label="Número de Cuenta" onChange={(ev) => {
          setPayroll({ accountNumber: ev.target.value })
        }} />
      <QuickFormButton
        disabled={loading}
        fullWidth variant='contained' color='primary' type='submit'>{loading ? 'Guardando' : btnText}</QuickFormButton>
    </QuickFormContainer>
  )
}