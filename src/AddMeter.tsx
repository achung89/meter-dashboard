import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Input, Typography } from "@mui/material";
import { InputLabel } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IPOSTAndPUTMeterAPIReq } from "./useAsyncMeters";
import { MenuItem, Select } from "@mui/material";


export const AddMeter = ({ onSubmit }: { onSubmit: (data: IPOSTAndPUTMeterAPIReq) => void }) => {
  const [show, setShow] = useState(false);
  const { register, handleSubmit } = useForm();
  const onClick = (data: object) => {
    onSubmit({
      // default values
      active: false,
      used_for_billing: false,
      ...data
    } as IPOSTAndPUTMeterAPIReq);
  };

  return show ? <Box sx={{ 'margin': '1rem' }}><Typography variant="h5" component="h2">Create new metric</Typography>
    <FormGroup row={true}><FormControl variant="outlined">
      <InputLabel htmlFor="api-name-field">API Name</InputLabel>
      <Input {...register('api_name', { required: true })} id="api-name-field" defaultValue="" />
    </FormControl>
      <FormControl variant="outlined">
        <InputLabel htmlFor="display-name-field">Display Name</InputLabel>
        <Input {...register('display_name', { required: true })} id="display-name-field" defaultValue="" />
      </FormControl>
      <FormControlLabel control={<Checkbox inputProps={{ 'aria-label': 'is-active-checkbox', }} />} {...register('active')} label="Active" />
      <FormControlLabel control={<Checkbox inputProps={{ 'aria-label': 'is-used-for-billing', }} />} {...register('used_for_billing')} label="Used for billing" />
      <Select inputProps={register('type', { required: true })} defaultValue='sum'>
        <MenuItem value="sum">Sum</MenuItem>
        <MenuItem value="max">Max</MenuItem>
        <MenuItem value="unique_count">Unique Count</MenuItem>
      </Select>
      <Button sx={{marginLeft: '1rem'}} variant="contained" onClick={handleSubmit(onClick)}>Submit</Button>
    </FormGroup> </Box> : <Button variant="contained" onClick={() => setShow(true)}>+</Button>
}