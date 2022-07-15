import { useDispatch } from 'react-redux'

// UI imports
// import Button from 'ui/Button'
// import Input from 'ui/Input'
import { showMessage } from 'setup/messageSlice';
import './style.css'

import { SET_CHECK } from 'modules/mail/api/actions/types'
import { list } from 'modules/mail/api/actions/query'

import { Checkbox, Button } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import styled from '@emotion/styled'

const UnSelectedButton = styled(Button)`
  background: #e3e9ee;
  color: #34a196;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 20px;
  height: 44px;
  border-radius: 100px;
`

const SelectedButton = styled(Button)`
  background: #34a196;
  color: white;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 20px;
  height: 44px;
  border-radius: 100px;
`

const GetMailCheckbox = ({
  // name,
  // value,
  brand,
  isChecked,
  // setChecked,
  isLoading,
  isLoadingToggle,
  setMails,
}) => {
  const dispatch = useDispatch()
  // const [isChecked, setIsChecked] = useState(false);
  // console.log("🚀 ~ file: index.js ~ line 66 ~ isChecked", isChecked)

  const handleChange = async (params) => {
    isLoadingToggle(true)
    try {
      const { data } = await list(params)

      if (data.success && data.data) {
        setMails(data.data)
      } else {
        setMails([])
        dispatch(
          showMessage({
            message: `There is no Order!`,
            variant: 'error',
          })
        );
      }
    } catch (error) {
      console.log(error)
      dispatch(
        showMessage({
          message: error.message,
          autoHideDuration: 2000,
          variant: 'error',
        })
      );
    } finally {
      isLoadingToggle(false)
    }
  }

  return (
    <Checkbox
      disableRipple
      sx={{ p: 0, m: '10px' }}
      checked={isChecked.findIndex((element) => element === brand) > -1}
      disabled={isLoading}
      onChange={(e) => {
        if (isChecked.findIndex((element) => element === brand) > -1) {
          isLoadingToggle(true)
          for (var i = 0; i < isChecked.length; i++) {
            if (isChecked[i] === brand) {
              isChecked.splice(i, 1)
              handleChange(isChecked).then(() => {
                dispatch({
                  type: SET_CHECK,
                  payload: isChecked
                })
                isLoadingToggle(false)
              })
            }
          }
          // setIsChecked(false)
        } else {
          handleChange([...isChecked, brand]).then(() => {
            dispatch({
              type: SET_CHECK,
              payload: [...isChecked, brand]
            })
            // setIsChecked(true)
          })
        }
      }}
      icon={
        <UnSelectedButton variant='contained' color='primary'>
          {brand}
        </UnSelectedButton>
      }
      checkedIcon={
        <SelectedButton
          variant='contained'
          color='primary'
          startIcon={<CheckIcon />}
        >
          {brand}
        </SelectedButton>
      }
    />
  )
}
export default GetMailCheckbox
