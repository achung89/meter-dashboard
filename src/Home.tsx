import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from "@mui/material";
import { AddMeter } from "./AddMeter";
import { IGETMeterAPIRes, IPOSTAndPUTMeterAPIReq, useAsyncMeters } from "./useAsyncMeters";
import { capitalize } from "lodash";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import lodashOrderBy from 'lodash.orderby';

const metersPropsMap: Omit<Record<keyof IGETMeterAPIRes, string>, 'id'> = {
  api_name: 'API Name',
  display_name: 'Display Name',
  active: 'Is Active',
  used_for_billing: 'Is Used For Billing',
  type: 'Type',
  updated_time: 'Created At',
  created_time: 'Updated At',
}

const useDirection = () => {
  const directions = ['asc', 'desc', undefined];
  const [index, setIndex] = useState(0);
  const toggle = () => {
    setIndex(index => index === directions.length - 1 ? 0 : index + 1);
  }
  const reset = () => {
    setIndex(0);
  }
  return {
    direction: directions[index] as 'asc' | 'desc' | undefined,
    toggle,
    reset,
  }
}


const useColumnSort = () => {
  const { direction, toggle, reset } = useDirection();
  const [orderBy, setOrderBy] = useState<keyof IGETMeterAPIRes | null>(null);
  const setOrder = (orderByProp: keyof IGETMeterAPIRes) => {
    if (orderBy === orderByProp) {
      toggle();
    } else {
      reset();
      setOrderBy(orderByProp)
    }
  }

  return {
    orderBy,
    direction,
    setOrder,
  }
}

export const Home = ({ meters, postAsyncMeters }: { meters: IGETMeterAPIRes[], postAsyncMeters: (newMeter: IPOSTAndPUTMeterAPIReq) => Promise<void> }) => {
  const history = useHistory();
  const { orderBy, direction, setOrder } = useColumnSort();

  if (orderBy && direction) {
    meters = lodashOrderBy(meters, [orderBy], [direction]);
  }

  return <div>
    <header>
      <Typography variant="h2" component="h1">Meters</Typography>
    </header>
    <main>
      <AddMeter onSubmit={postAsyncMeters} />
      <br />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {
                Object.entries(metersPropsMap).map(([prop, displayName]) => <TableCell sx={{ cursor: 'pointer' }} onClick={() => setOrder(prop as keyof IGETMeterAPIRes)} >
                  <TableSortLabel
                    key={prop}
                    active={orderBy === prop && direction !== undefined}
                    direction={orderBy === prop ? direction : 'asc'}
                  >{displayName}</TableSortLabel>
                </TableCell>)
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {meters.map((props: IGETMeterAPIRes) => {
              const { created_time, id, api_name, display_name, active, used_for_billing, type, updated_time } = props
              const isActiveText = capitalize(String(active));
              const isUsedForBillingText = capitalize(String(used_for_billing));
              const dateTimeFormat = new Intl.DateTimeFormat('en', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                second: 'numeric',
                minute: 'numeric',
              });

              const createdAtText = dateTimeFormat.format(new Date(created_time));
              const updatedAtText = dateTimeFormat.format(new Date(updated_time));
              return <TableRow key={id}
                onClick={() => history.push(`/${id}`)}
                sx={{
                  cursor: "pointer"
                }}>
                <TableCell component="th" scope="row">
                  {api_name}
                </TableCell>
                <TableCell>{display_name}</TableCell>
                <TableCell>{isActiveText}</TableCell>
                <TableCell>{isUsedForBillingText}</TableCell>
                <TableCell>{type}</TableCell>
                <TableCell>{createdAtText}</TableCell>
                <TableCell>{updatedAtText}</TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>


    </main>
  </div >
}