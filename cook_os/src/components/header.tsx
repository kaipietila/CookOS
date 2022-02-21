import { Typography } from "@mui/material"


export const Header = () => {
    const header: string = 'CookOs'
    return (
        <div style={{ margin: '50px 250px 50px 250px', backgroundColor: '#18dfed' }}>
            <Typography variant='h1' sx={{ 
                paddingLeft: '-50px', 
                color: '#f25c16',
                marginBottom: '150px',
                marginTop: '150px', 
                display: 'flex',
                flexDirection: 'row', 
                justifyContent: 'center'}}
                >
                {header}
            </Typography>
        </div>
    )
}