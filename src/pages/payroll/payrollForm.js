import { QuickFormButton, QuickFormContainer, QuickFormInput } from '../../components/Containers/QuickFormContainer';
import { useCState } from '../../hooks/useHooks';

export function PayrollForm ({ onSubmit }) {
  const [payroll, setPayroll] = useCState({})
  return (
    <QuickFormContainer title='Nomina' onSubmit={() => {
      onSubmit(payroll)
    }}>
      <QuickFormInput fullWidth label="Nombre" onChange={(ev) => {
        setPayroll({ name: ev.target.value })
      }} />
      <QuickFormInput fullWidth label="Salario por dia" type='number'
        onChange={(ev) => {
          setPayroll({ salaryPerDay: ev.target.value })
        }}
      />
      <QuickFormButton fullWidth variant='contained' color='primary' type='submit'>Guardar</QuickFormButton>
    </QuickFormContainer>
  )
}