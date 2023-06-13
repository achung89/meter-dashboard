import { useEffect, useState } from 'react';
const API_KEY = '019e435e5836885ac78f1540a98cefa35f5c0adb18305338eced2eeff2b2d0ef'
export type IGETMeterAPIRes = {
  "id": string;
  "api_name": string;
  "display_name": string;
  "active": boolean;
  "used_for_billing": boolean;
  "type": "sum" | "max" | "unique_count";
  "updated_time": string;
  "created_time": string;
};
export type IPOSTAndPUTMeterAPIReq = {
  "api_name": string,
  "display_name": string,
  "active": boolean,
  "used_for_billing": boolean,
  "type": "sum" | "max" | "unique_count"
}

const getMeters = (controller: AbortController) => {
  return fetch('https://take-home-exercise-api.herokuapp.com/meters', {
    signal: controller.signal,
    headers: {
      'API-KEY': API_KEY
    }
  })
    .then(res => res.json());
};

const postMeters = (meter: IPOSTAndPUTMeterAPIReq) => fetch('https://take-home-exercise-api.herokuapp.com/meters', {
    method: 'POST',
    body: JSON.stringify(meter),
    headers: {
      'API-KEY':API_KEY,
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json());

const putMeters = (id: string, meter: IPOSTAndPUTMeterAPIReq) => fetch(`https://take-home-exercise-api.herokuapp.com/meters/${id}`, {
  method: 'PUT',
  body: JSON.stringify(meter),
  headers: {
    'API-KEY':API_KEY,
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json());

const deleteMeters = (id: string) => fetch(`https://take-home-exercise-api.herokuapp.com/meters/${id}`, {
  method: 'DELETE',
  headers: {
    'API-KEY':API_KEY,
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json());

type FetchStatus = 'loading' | 'loaded' | 'error';

export const useAsyncMeters = () => {
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [meters, setMeters] = useState<IGETMeterAPIRes[]>([]);
  const refresh = () => {
    setFetchStatus('loading');
  };

  useEffect(() => {
    if (fetchStatus === 'loading') {
      const controller = new AbortController();

      getMeters(controller)
        .then(meters => {
          setMeters(() => meters);
          setFetchStatus(() => 'loaded');
        })
        .catch((err: Error) => {
          if(err.message !== 'The user aborted a request.') {
            setFetchStatus(() => 'error');
            setErrorMessage(() => err.name + ': ' + err.message);
          }
        });
        return () => controller.abort();
    }

  }, [fetchStatus]);

  const postAsyncMeters = async (newMeter: IPOSTAndPUTMeterAPIReq) => {
    try {
      await postMeters(newMeter);
      refresh();
    } catch (err: any) {
      setFetchStatus('error');
      setFetchStatus(() => 'error');
      setErrorMessage(() => err.name + ': ' + err.message);
    }
  };

  const putAsyncMeters = async (id:string, meter: IPOSTAndPUTMeterAPIReq) => {
    await putMeters(id, meter);
    refresh();
  }
  
  const deleteAsyncMeters = async (id:string) => {
    await deleteMeters(id);
    refresh();
  };

  return {
    errorMessage,
    fetchStatus,
    meters,
    postAsyncMeters,
    putAsyncMeters,
    deleteAsyncMeters
  };
};
