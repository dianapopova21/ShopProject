import React from 'react'
import Header from '../../../components/Header/Header'
import Footer from '../../../components/Footer/Footer'
import Filter from '../../Shop/Filter/Filter'
import ClothesCards from '../Underpants/components/ClothesCards'
import style from './Pyjamas.module.scss'
import { Container } from '@mui/material'

export default function News() {
    const { filter, flexFilter } = style
    return (
        <div>
            <Header />
            <Container maxWidth="lg" breakPoint="lg">
                <div className={flexFilter}>
                    <div className={filter}>
                        <Filter />
                    </div>
                    <ClothesCards item="Піжами" category="pyjamas" />
                </div>
            </Container>
            <Footer />
        </div>
    )
}
