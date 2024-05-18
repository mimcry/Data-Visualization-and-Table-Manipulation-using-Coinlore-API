import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Table, Typography, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, InputAdornment, 
  IconButton, Container, Box, TableSortLabel, MenuItem, Select, FormControl, InputLabel,Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const CryptoTable = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filterCriteria, setFilterCriteria] = useState("");

  useEffect(() => {
    axios.get('https://api.coinlore.net/api/tickers/')
      .then(response => {
        setCryptos(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterCriteria(event.target.value);
  };

  const quickSort = (array, key, direction) => {
    if (array.length <= 1) return array;

    const pivot = array[Math.floor(array.length / 2)];
    const left = [];
    const right = [];

    for (let i = 0; i < array.length; i++) {
      if (i === Math.floor(array.length / 2)) continue;

      const a = array[i][key];
      const b = pivot[key];

      const aStr = isNaN(a) ? a.toString().toLowerCase() : parseFloat(a);
      const bStr = isNaN(b) ? b.toString().toLowerCase() : parseFloat(b);

      if (direction === 'ascending') {
        if (aStr < bStr) left.push(array[i]);
        else right.push(array[i]);
      } else {
        if (aStr > bStr) left.push(array[i]);
        else right.push(array[i]);
      }
    }

    return [...quickSort(left, key, direction), pivot, ...quickSort(right, key, direction)];
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredCryptos = cryptos.filter((crypto) => {
    const searchQuery = search.toLowerCase();
    const id = crypto.id.toString().toLowerCase();
    const name = crypto.name.toLowerCase();
    const symbol = crypto.symbol.toLowerCase();
    return searchQuery === "" || name.includes(searchQuery) || id.includes(searchQuery) || symbol.includes(searchQuery);
  });

  const filteredAndSortedCryptos = filteredCryptos.filter((crypto) => {
    switch (filterCriteria) {
      case 'rank':
        return parseInt(crypto.rank) === 1;
      case 'price':
        return parseFloat(crypto.price_usd) > 100;
      case 'percentageChange':
        return parseFloat(crypto.percent_change_24h) > 5;
      default:
        return true;
    }
  }).sort((a, b) => {
    if (sortConfig.key !== null) {
      const aValue = isNaN(a[sortConfig.key]) ? a[sortConfig.key].toLowerCase() : parseFloat(a[sortConfig.key]);
      const bValue = isNaN(b[sortConfig.key]) ? b[sortConfig.key].toLowerCase() : parseFloat(b[sortConfig.key]);
      if (sortConfig.direction === 'ascending') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    } else {
      return 0;
    }
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading data: {error.message}</p>;
  }

  return (
    <Container>
      <Box>
      
       
          <TableContainer component={Paper} sx={{ padding: 3, mt: 3, boxShadow: 24 }}>
              <Box sx={{alignItems: "center", mb: 2 }}>
                <Grid container spacing={1}><Grid item lg={4} md={4} sm={12} xs={12}> <Typography sx={{ mb: 2, fontSize: "1.6rem", fontWeight: "bold" }}>Cryptocurrency Prices</Typography></Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}><TextField
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  height: '40px',  
                  '& .MuiInputBase-input': {
                    height: '30px', 
                    padding: '4px 8px',
                  },
                  '& .MuiOutlinedInput-root': {
                    height: '40px', 
                    '& fieldset': {
                      height: '30px',  
                    },
                  },
                }
              }}
              sx={{ 
                borderRadius: 25, ml: "auto"
              }}
            /></Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
  <FormControl 
    sx={{ 
      ml: "auto",
      width: "40%",
      height: '40px'  // Set the desired height here
    }}
  >
    <InputLabel 
      id="filter-label" 
      sx={{
        height: '60px',
        lineHeight: '40px',
        mt:-2  // Align the label with the new height
      }}
    >
      Filter by
    </InputLabel>
    <Select
      labelId="filter-label"
      id="filter-select"
      value={filterCriteria}
      onChange={handleFilterChange}
      sx={{
        height: '40px',  // Adjust the height of the select box
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <MenuItem value="">None</MenuItem>
      <MenuItem value="rank">Rank</MenuItem>
      <MenuItem value="price">Price</MenuItem>
      <MenuItem value="percentageChange">Percentage Change</MenuItem>
    </Select>
  </FormControl>
</Grid>

                </Grid>
         
          
        
        </Box>
        {filteredAndSortedCryptos.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow >
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'id'}
                      direction={sortConfig.direction === 'ascending' ? 'asc' : 'desc'}
                      onClick={() => handleSort('id')}
                      
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'name'}
                      direction={sortConfig.direction === 'ascending' ? 'asc' : 'desc'}
                      onClick={() => handleSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'rank'}
                      direction={sortConfig.direction === 'ascending' ? 'asc' : 'desc'}
                      onClick={() => handleSort('rank')}
                    >
                      Rank
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'price_usd'}
                      direction={sortConfig.direction === 'ascending' ? 'asc' : 'desc'}
                      onClick={() => handleSort('price_usd')}
                    >
                      Price (USD)
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'percent_change_24h'}
                      direction={sortConfig.direction === 'ascending' ? 'asc' : 'desc'}
                      onClick={() => handleSort('percent_change_24h')}
                    >
                      Percentage Change (24h)
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'price_btc'}
                      direction={sortConfig.direction === 'ascending' ? 'asc' : 'desc'}
                      onClick={() => handleSort('price_btc')}
                    >
                      Price (BTC)
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'market_cap_usd'}
                      direction={sortConfig.direction === 'ascending' ? 'asc' : 'desc'}
                      onClick={() => handleSort('market_cap_usd')}
                    >
                      Market Cap (USD)
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedCryptos.map(crypto => (
                  <TableRow key={crypto.id} className={crypto.rank === 1 ? "highlight-row" : ""}>
                    <TableCell   className={sortConfig.key === 'id' ? 'sorted-column' : ''}>{crypto.id}</TableCell>
                    <TableCell  className={sortConfig.key === 'name' ? 'sorted-column' : ''}>{crypto.name}</TableCell>
                    <TableCell  className={sortConfig.key === 'rank' ? 'sorted-column' : ''}>{crypto.rank}</TableCell>
                    <TableCell  className={sortConfig.key === 'price_usd' ? 'sorted-column' : ''}>${crypto.price_usd}</TableCell>
                    <TableCell  className={sortConfig.key === 'percent_change_24h' ? 'sorted-column' : ''}>{crypto.percent_change_24h}</TableCell>
                    <TableCell  className={sortConfig.key === 'price_btc' ? 'sorted-column' : ''}>{crypto.price_btc}</TableCell>
                    <TableCell  className={sortConfig.key === 'market_cap_usd' ? 'sorted-column' : ''}>${crypto.market_cap_usd}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> ) : (
          <Box style={{ textAlign: 'center', marginTop: '20px' }}>
            <img
              src="https://static.vecteezy.com/system/resources/previews/004/896/133/original/what-you-were-looking-was-not-found-search-not-found-concept-illustration-flat-design-eps10-modern-style-graphic-element-for-landing-page-empty-state-ui-infographic-etc-vector.jpg"
              alt="Not found"
              style={{
                height: '400px',
                width: '100%',
                maxWidth: '1000px',
                objectFit: 'contain',
              }}
            />
            <Typography sx={{ fontSize: "1.5rem" }}>Sorry, your item was not found</Typography>
          </Box>
        )}
          </TableContainer>
       
      </Box>
    </Container>
  );
};

export default CryptoTable;

