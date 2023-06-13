import { Button, Checkbox, Input, Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { IGETMeterAPIRes } from './useAsyncMeters';
import { useHistory } from 'react-router-dom';
import { TypographyProps, styled } from '@mui/system';

const Wrapper = styled('div')`
  margin: 2rem 3rem;
`

const H1 = styled(Typography) <TypographyProps & { component: React.ElementType }>`
  margin-bottom: .5rem;
`;
// keep all style related properties in same location
H1.defaultProps = {
  variant: 'h2',
}

export const MeterDetailsPage = ({ meters, putAsyncMeters, deleteAsyncMeters }: { meters: IGETMeterAPIRes[]; putAsyncMeters: (id: string, data: any) => Promise<any>; deleteAsyncMeters: (id:string) => Promise<any>}) => {
  const { meterId } = useParams<{ meterId: string; }>();
  const { api_name, display_name, active, used_for_billing, type } = meters.find(({ id }: { id: string; }) => id === meterId) ?? {};
  const { register, handleSubmit } = useForm();
  const history = useHistory();

  const onSubmit = async () => {
    await handleSubmit(data => putAsyncMeters(meterId, data))();
    history.push('/');
  };
  
  const onDelete = async () => {
    await deleteAsyncMeters(meterId);
    history.push('/');
  };

  return <Wrapper>
    <header>
      <H1 component="h1">Meter Details</H1>
    </header>
    <main>
      <Input {...register('api_name', { required: true })} id="api-name-field" defaultValue={api_name} />
      <Input {...register('display_name', { required: true })} id="display-name-field" defaultValue={display_name} />
      <Checkbox inputProps={{ 'aria-label': 'is-active-checkbox', }} {...register('active')} defaultChecked={active} />
      <Checkbox inputProps={{ 'aria-label': 'is-used-for-billing', }} {...register('used_for_billing')} defaultChecked={used_for_billing} />
      <Select inputProps={register('type', { required: true })} defaultValue={type}>
        <MenuItem value="sum">Sum</MenuItem>
        <MenuItem value="max">Max</MenuItem>
        <MenuItem value="unique_count">Unique Count</MenuItem>
      </Select>
      {/* placeholder for created at column */}
      {/* placeholder for updated at column */}

      <Button sx={{ marginLeft: '2rem' }} variant="contained" onClick={onSubmit}>Update</Button>
      <Button sx={{ marginLeft: '2rem'}} variant="outlined" color="error" onClick={onDelete}>Delete</Button>
    </main>
  </Wrapper>;
};
